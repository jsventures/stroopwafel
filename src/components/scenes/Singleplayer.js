import { Text, View, TouchableOpacity } from "react-native";
import { useState, useEffect, useContext } from "react";

import { UserContext } from "@/Context";
import SafeView from "@/components/shared/SafeView";
import {
  primaryBackgroundColor as bgColor,
  infoTextColor,
} from "@/components/shared/styles";
import { chooseRandomColor, colorStyleMap } from "@/game";

// Consts
// ------------------
const INITIAL_CLOCK = 5;
const INITIAL_SCORE = 0;

// Screen
// ------------------
function Singleplayer({ navigation, route }) {
  const user = useContext(UserContext);
  const [clock, setClock] = useState(INITIAL_CLOCK);
  const [score, setScore] = useState(INITIAL_SCORE);
  const [label, setLabel] = useState(chooseRandomColor());
  const [color, setColor] = useState(chooseRandomColor());
  const textColor = `text-${color}-400`;

  const { highScore } = user;
  const { resetGame } = route.params;

  // Reset Game
  useEffect(() => {
    if (resetGame) {
      setClock(INITIAL_CLOCK);
      setScore(INITIAL_SCORE);
      setLabel(chooseRandomColor());
      setColor(chooseRandomColor());
      route.params.resetGame = false;
    }
  }, [resetGame]);

  // Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setClock((prevClock) => {
        if (prevClock < 2) {
          return 0;
        }
        return prevClock - 1;
      });
    }, 600);

    return () => clearInterval(timer);
  }, []);

  // End Game
  useEffect(() => {
    if (clock === 0) {
      navigation.navigate("GameOverSingleplayer", { score });
    }
  }, [clock]);

  const onPress = (sqColor) => {
    if (sqColor == label) {
      setScore((prevScore) => prevScore + 1);
      setClock((prevClock) => prevClock + 1);
      setLabel(chooseRandomColor());
      setColor(chooseRandomColor());
    } else {
      setScore((prevScore) => Math.max(prevScore - 2, 0));
    }
  };

  return (
    <SafeView className={`flex-1 ${bgColor}`}>
      {/* Top Bar */}
      <View className="flex-row justify-between items-center px-8">
        <View className="justify-between space-y-1">
          <Text className={`font-bold text-xl ${infoTextColor}`}>
            Best: {highScore}
          </Text>
        </View>
        <Text className={`font-bold text-5xl ${infoTextColor}`}>{score}</Text>
      </View>

      {/* Color Label */}
      <View className="flex-1 justify-center items-center">
        <Text
          style={colorStyleMap[textColor]}
          className="font-bold text-5xl uppercase"
        >
          {label}
        </Text>
      </View>

      {/* Grid Boxes */}
      <View className="flex-1 flex-row flex-wrap justify-center mx-8">
        <TouchableOpacity
          onPress={() => onPress("red")}
          className="w-28 h-28 bg-red-400 m-1"
        ></TouchableOpacity>
        <TouchableOpacity
          onPress={() => onPress("green")}
          className="w-28 h-28 bg-green-400 m-1"
        ></TouchableOpacity>
        <TouchableOpacity
          onPress={() => onPress("blue")}
          className="w-28 h-28 bg-blue-400 m-1"
        ></TouchableOpacity>
        <TouchableOpacity
          onPress={() => onPress("yellow")}
          className="w-28 h-28 bg-yellow-400 m-1"
        ></TouchableOpacity>
      </View>
    </SafeView>
  );
}

export default Singleplayer;
