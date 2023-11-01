import {
  TouchableOpacity,
  View,
  Text,
  TextInput,
  Animated,
} from "react-native";
import { useQuery, transact, tx } from "@instantdb/react-native";
import React, { useState, useRef, useEffect, useContext } from "react";

import SafeView from "@/components/shared/SafeView";
import {
  primaryBackgroundColor as bgColor,
  regularButtonStyle,
  infoTextColor as textColor,
} from "@/components/shared/styles";
import {
  LoadingPlaceholder,
  ErrorPlaceholder,
} from "@/components/shared/Placeholder";
import { UserContext } from "@/Context";

const textStyle = "text-4xl text-center";

const violet100 = "rgb(237 233 254);";
const red300 = "rgb(252, 165, 165)";
const validColor = violet100;
const invalidColor = red300;

function JoinRoomButton({ isValidRoomCode, onPress }) {
  const animatedValue = useRef(
    new Animated.Value(isValidRoomCode ? 0 : 1)
  ).current;
  const interpolatedBackgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [validColor, invalidColor],
  });
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isValidRoomCode ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isValidRoomCode]);

  return (
    <TouchableOpacity
      disabled={!isValidRoomCode}
      className={`${regularButtonStyle} my-4`}
      style={{ backgroundColor: interpolatedBackgroundColor }}
      onPress={onPress}
    >
      <Text className={`${textStyle}`}>Join</Text>
    </TouchableOpacity>
  );
}

function JoinRoom({ route, navigation }) {
  const user = useContext(UserContext);
  const [roomCode, setRoomCode] = useState(route.params?.code || "");
  const [joinRoom, setJoinRoom] = useState(null);
  const { error, data } = useQuery({
    rooms: { $: { where: { code: roomCode } } },
  });
  const room = data?.["rooms"]?.[0];

  useEffect(() => {
    if (!joinRoom) return;
    transact(tx.rooms[joinRoom.id].link({ users: user.id }));
    const nextScreen = joinRoom.currentGameId
      ? ["Multiplayer", { gameId: joinRoom.currentGameId }]
      : ["WaitingRoom", { code: joinRoom.code }];
    navigation.navigate(...nextScreen);
  }, [joinRoom?.code]);

  if (error) return <ErrorPlaceholder error={error} />;

  const handleJoin = () => {
    // (XXX): We use an extra state variable to avoid a flicker. Otheriwse
    // would have transacted here
    setJoinRoom(room);
  };

  return (
    <SafeView className={`flex-1 items-center ${bgColor}`}>
      <View className="flex-1 w-full px-8">
        <View className="flex-1 justify-end">
          <Text
            className={`text-2xl font-semibold my-4 text-center ${textColor}`}
          >
            Enter room code
          </Text>
          <TextInput
            defaultValue={roomCode}
            autoCapitalize="characters"
            autoCorrect={false}
            className={`h-20 p-2 text-4xl text-center border-4 border-amber-400 ${textColor} font-semibold`}
            onEndEditing={(e) => setRoomCode(e.nativeEvent.text)}
          />
        </View>
        <View className="flex-1 justify-end">
          <JoinRoomButton isValidRoomCode={!!room} onPress={handleJoin} />
        </View>
      </View>
    </SafeView>
  );
}

export default JoinRoom;
