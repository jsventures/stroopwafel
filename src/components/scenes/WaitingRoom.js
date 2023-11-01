import { useContext, useEffect, useState } from "react";
import { Text, TouchableOpacity, View, ScrollView } from "react-native";
import { HeaderBackButton } from "@react-navigation/elements";
import { transact, tx, useQuery, id } from "@instantdb/react-native";
import Toast from "react-native-root-toast";
import * as Clipboard from "expo-clipboard";

import { GAME_IN_PROGRESS, generateGameColors, leaveRoomTx } from "@/game";
import SafeView from "@/components/shared/SafeView";
import { avatarColor } from "@/utils/profile";
import { now } from "@/utils/time";
import {
  primaryBackgroundColor as bgColor,
  HEADER_TINT_COLOR,
  RegularButton,
} from "@/components/shared/styles";
import {
  LoadingPlaceholder,
  ErrorPlaceholder,
} from "@/components/shared/Placeholder";
import { UserContext } from "@/Context";

function userSort(a, b) {
  // Host comes first
  if (a.isHost) return -1;
  if (b.isHost) return 1;

  // You comes second
  if (a.isYou) return -1;
  if (b.isYou) return 1;

  // Sort the rest alphabetically by handle
  return a.handle.localeCompare(b.handle);
}

function startMultiplayerGame(room) {
  const gameId = id();
  const { users } = room;
  const colors = generateGameColors();

  const playerIds = users
    .filter((u) => u.id === room.hostId || room.readyIds.includes(u.id))
    .map((u) => u.id);
  const createGame = tx.games[gameId].update({
    status: GAME_IN_PROGRESS,
    playerIds,
    colors,
    created_at: now(),
  });
  const addUserGameLinks = users.map((u) =>
    tx.games[gameId].link({ users: u.id })
  );
  const createPoints = playerIds.map((playerId) =>
    tx.points[id()].update({ val: 0, userId: playerId }).link({ games: gameId })
  );
  const updateRoom = tx.rooms[room.id]
    .update({
      currentGameId: gameId,
      readyIds: [],
    })
    .link({ games: gameId });

  transact([createGame, ...addUserGameLinks, ...createPoints, updateRoom]);
}

function InviteButton({ code }) {
  async function copy(code) {
    await Clipboard.setStringAsync(
      `Let's play Stroopwafel! You can join my room at

https://stroopwafel.app/join/${code}`
    );
    Toast.show("Game code copied! Send it over to your friends :)", {
      duration: Toast.durations.LONG,
    });
  }
  return (
    <RegularButton onPress={() => copy(code)}>Invite Friends</RegularButton>
  );
}

function UserPill({ user, room, isReady, isAdmin }) {
  const { isYou, isHost, id: userId, handle } = user;
  const { id: roomId, readyIds, kickedIds } = room;

  // Avatar
  const avatarStyle = avatarColor(handle);

  // Title
  let title = [];
  if (isHost) {
    title.push("Host");
  }
  if (isYou) {
    title.push("You");
  }
  title = title.join(", ");

  // Ready Indicator
  const readyDot = isHost || isReady ? "bg-green-400" : "bg-slate-700";

  return (
    <View className="flex-row rounded-xl border-2 border-violet-300 items-center my-2 py-4">
      <View className={`mx-4 w-12 h-12 ${avatarStyle} rounded-full`} />
      <View className="flex-1 space-y-1">
        <Text className="text-lg text-slate-100 font-bold">{handle}</Text>
        <Text className="text-md text-slate-100 font-semibold">{title}</Text>
      </View>
      <View className="justify-end">
        {isAdmin && !isYou && (
          <TouchableOpacity
            className="bg-red-400 rounded-full"
            onPress={() =>
              transact(
                tx.rooms[roomId]
                  .update({
                    kickedIds: [...kickedIds, userId],
                    readyIds: readyIds.filter((x) => x !== userId),
                  })
                  .unlink({ users: userId })
              )
            }
          >
            <Text className="py-2 px-4 text-slate-100 font-semibold">Kick</Text>
          </TouchableOpacity>
        )}
      </View>
      <View className={`mx-4 justify-end ${readyDot} rounded-full w-4 h-4`} />
    </View>
  );
}

function WaitingRoom({ route, navigation }) {
  const user = useContext(UserContext);
  const { code } = route.params;
  const { isLoading, error, data } = useQuery({
    rooms: { users: {}, $: { where: { code: code } } },
  });
  const room = data?.rooms?.[0];
  const isAdmin = room?.hostId === user.id;

  // Set up leave button
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderBackButton
          tintColor={HEADER_TINT_COLOR}
          label="Leave"
          onPress={() => {
            leaveRoomTx(user.id, room, navigation);
          }}
        />
      ),
    });
  }, [navigation, room]);

  // Handle navigating away from rooms
  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!room) {
      Toast.show("This room was deleted!", {
        duration: Toast.durations.LONG,
      });
      navigation.navigate("Main");
      return;
    }
    if (!room.users.find((u) => u.id === user.id)) {
      navigation.navigate("Main");
      return;
    }
    if (room.kickedIds.includes(user.id)) {
      Toast.show("You were kicked from the room 🤷‍♂️.", {
        duration: Toast.durations.SHORT,
      });
      navigation.navigate("Main");
      return;
    }

    if (room.currentGameId) {
      navigation.navigate("Multiplayer", { gameId: room.currentGameId });
      return;
    }
  }, [isLoading, room]);

  if (isLoading || !room) return <LoadingPlaceholder />;
  if (error) return <ErrorPlaceholder error={error} />;

  const users = room.users
    .map((u) => {
      return {
        ...u,
        isHost: room.hostId === u.id,
        isYou: u.id === user.id,
      };
    })
    .sort(userSort);

  const isReady = room.readyIds.includes(user.id);
  const readyText = isReady ? "Not Ready" : "Ready!";

  return (
    <SafeView className={`flex-1 justify-center ${bgColor}`}>
      <View className="flex-1 w-full px-8">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-1 justify-start -mt-2">
            {users.map((u) => {
              const isReady = room.readyIds.includes(u.id);
              return (
                <UserPill
                  key={u.id}
                  user={u}
                  room={room}
                  isReady={isReady}
                  isAdmin={isAdmin}
                />
              );
            })}
          </View>
        </ScrollView>
        <View className="flex-1 justify-end space-y-4">
          <InviteButton code={room.code} />
          {isAdmin ? (
            <RegularButton onPress={() => startMultiplayerGame(room)}>
              Start!
            </RegularButton>
          ) : (
            <RegularButton
              onPress={() => {
                const { id: roomId, readyIds } = room;
                const markReady = tx.rooms[roomId].update({
                  readyIds: [...readyIds, user.id],
                });
                const markNotReady = tx.rooms[roomId].update({
                  readyIds: readyIds.filter((x) => x !== user.id),
                });
                const toggleReady = isReady ? markNotReady : markReady;
                transact(toggleReady);
              }}
            >
              {readyText}
            </RegularButton>
          )}
        </View>
      </View>
    </SafeView>
  );
}

export default WaitingRoom;
