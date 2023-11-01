import { Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useContext } from "react";
import { useQuery, transact, tx } from "@instantdb/react-native";

import SafeView from "@/components/shared/SafeView";
import Race from "@/components/shared/Race";
import {
  RegularButton,
  primaryBackgroundColor as bgColor,
  infoTextColor as textColor,
} from "@/components/shared/styles";
import {
  LoadingPlaceholder,
  ErrorPlaceholder,
} from "@/components/shared/Placeholder";
import { UserContext } from "@/Context";
import { now } from "@/utils/time";
import { leaveRoomTx } from "@/game";

// Consts
// ------------------
const rankIcons = ["🏆", "🐇", "🐢"];

// Screen
// ------------------
function GameOverMultiPlayer({ navigation, route }) {
  const user = useContext(UserContext);
  const { gameId } = route.params;
  const { isLoading, error, data } = useQuery({
    games: { users: {}, rooms: {}, points: {}, $: { where: { id: gameId } } },
  });

  const game = data?.games?.[0];

  // Handle navigating away from game
  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!game) {
      Toast.show("Oh no! Looks like this game was abruptly deleted.", {
        duration: Toast.durations.LONG,
      });
      navigation.navigate("Main");
      return;
    }
  }, [isLoading, game]);

  if (isLoading || !game) return <LoadingPlaceholder />;
  if (error) return <ErrorPlaceholder error={error} />;

  const { points, rooms, playerIds, users } = game;
  const room = rooms[0];
  const { code, id: roomId, hostId } = room;

  const rankedPoints = points.sort((a, b) => b.val - a.val);
  const userMap = users.reduce((xs, u) => {
    xs[u.id] = u;
    return xs;
  }, {});
  const players = playerIds.map((playerId) => userMap[playerId]);
  const top3 = rankedPoints.map((p, i) => [i, userMap[p.userId]]).slice(0, 3);

  return (
    <SafeView className={`flex-1 px-8 ${bgColor}`}>
      {/* Top Bar */}
      <View className="mx-8 mt-4">
        <Race players={players} points={points} />
      </View>

      {/* Game Over */}
      <View className="items-center mt-16">
        <Text className={`font-bold  text-5xl uppercase ${textColor}`}>
          Game Over!
        </Text>
      </View>

      {/* Rankings */}
      <View className="flex-1 justify-center items-center space-y-2">
        {top3.map(([rank, { handle }]) => (
          <Text key={rank} className={`font-bold text-2xl ${textColor}`}>
            {rankIcons[rank]} {handle}
          </Text>
        ))}
      </View>

      {/* Buttons */}
      <View className="justify-center space-y-4 my-4">
        <RegularButton
          onPress={() => navigation.navigate("WaitingRoom", { code })}
        >
          Play Again
        </RegularButton>

        <RegularButton
          onPress={() => {
            leaveRoomTx(user.id, room);
            navigation.navigate("Main");
          }}
        >
          Menu
        </RegularButton>
      </View>
    </SafeView>
  );
}

export default GameOverMultiPlayer;
