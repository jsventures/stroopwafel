import { Text, View } from "react-native";
import { useEffect, useContext } from "react";
import { transact, tx } from "@instantdb/react-native";

import { UserContext } from "@/Context";
import SafeView from "@/components/shared/SafeView";
import {
  RegularButton,
  primaryBackgroundColor as bgColor,
  infoTextColor as textColor,
} from "@/components/shared/styles";

function GameOverSingleplayer({ navigation, route }) {
  const user = useContext(UserContext);
  const { score } = route.params;
  const { id: userId, highScore } = user;

  useEffect(() => {
    if (score > highScore) {
      transact(tx.users[userId].update({ highScore: score }));
    }
  }, []);
  const isHighScore = score > highScore ? true : false;
  const bestScore = isHighScore ? score : highScore;

  return (
    <SafeView className={`flex-1 px-8 ${bgColor}`}>
      {/* Top Bar */}
      <View className="flex-row justify-between items-center">
        <View className="justify-between space-y-1">
          <Text className={`font-bold text-xl ${textColor}`}>
            Best: {bestScore}
          </Text>
        </View>
        <Text className={`font-bold text-5xl ${textColor}`}>{score}</Text>
      </View>

      {/* Game Over */}
      <View className="items-center mt-16">
        <Text className={`font-bold text-5xl uppercase ${textColor}`}>
          Game Over!
        </Text>
      </View>

      {/* High Score */}
      {isHighScore && (
        <View className="flex-1 justify-center items-center mt-16 space-y-16">
          <Text className="font-bold text-3xl text-yellow-400">
            New High Score!
          </Text>
          <Text className="w-full font-bold text-8xl text-center">🏆</Text>
        </View>
      )}

      {/* Buttons */}
      <View className="flex-1 justify-end space-y-4 my-4">
        <RegularButton
          onPress={() =>
            navigation.navigate("Singleplayer", { resetGame: true })
          }
        >
          Play Again
        </RegularButton>

        <RegularButton onPress={() => navigation.navigate("Main")}>
          Menu
        </RegularButton>
      </View>
    </SafeView>
  );
}

export default GameOverSingleplayer;
