import { useState } from "react";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";

import SafeView from "@/components/shared/SafeView";
import {
  RegularButton,
  primaryBackgroundColor as bgColor,
  infoTextColor as textColor,
} from "@/components/shared/styles";
import Race from "@/components/shared/Race";

import { chooseRandomColor, colorStyleMap } from "@/game";

const GOAL = 13;

const infoTextStyle =
  "text-xl my-4 text-slate-100 font-semibold text-left leading-8";

const stroops = [
  ["red", "text-red-400"],
  ["yellow", "text-blue-400"],
  ["blue", "text-green-400"],
  ["green", "text-blue-400"],
  ["yellow", "text-red-400"],
  ["red", "text-yellow-400"],
  ["green", "text-green-400"],
  ["blue", "text-blue-400"],
  ["red", "text-red-400"],
  ["red", "text-yellow-400"],
  ["yellow", "text-yellow-400"],
  ["red", "text-yellow-400"],
  ["red", "text-red-400"],
  ["blue", "text-green-400"],
];

function MultiplayerHeader() {
  const characters = "Multiplayer".split("").map((c, i) => {
    const textColor = stroops[i][1];
    return (
      <Text
        key={i}
        style={colorStyleMap[textColor]}
        className="font-bold text-4xl uppercase my-2"
      >
        {c}
      </Text>
    );
  });
  return <View className="flex-row my-2">{characters}</View>;
}

function Stroop({ label, color }) {
  return (
    <Text className={`text-center text-3xl uppercase font-bold m-1 ${color}`}>
      {label}
    </Text>
  );
}

function HowToPlay({ navigation }) {
  const [score, setScore] = useState(0);
  const [label, setLabel] = useState(chooseRandomColor());
  const [color, setColor] = useState(chooseRandomColor());

  const onPress = (sqColor) => {
    if (sqColor == label) {
      setScore((prevScore) => prevScore + 1);
      setLabel(chooseRandomColor());
      setColor(chooseRandomColor());
    } else {
      setScore((prevScore) => Math.max(prevScore - 2, 0));
    }
  };

  const Grid = () => (
    <View className="flex-1 flex-row flex-wrap justify-center my-4 mx-8">
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
  );

  const colorKey = `text-${color}-400`;
  const labelColor = `text-${label}-400`;
  return (
    <SafeView className={`flex-1 px-8 ${bgColor}`}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap space-x-2 items-center justify-center">
          {stroops.map(([label, color], i) => (
            <Stroop key={i} label={label} color={color} />
          ))}
        </View>
        <Text className={infoTextStyle}>
          Do you find it a little difficult to read some of the words above? It
          can be a little confusing to{" "}
          <Text className="text-red-400 font-bold">read</Text> one color, but
          <Text className="text-green-400 font-bold"> see</Text> another -- this
          is known as the{" "}
          <Text className="text-center font-bold">Stroop Effect!</Text>
        </Text>

        <View className="flex-1 justify-center items-center">
          <Text
            style={colorStyleMap[colorKey]}
            className="font-bold text-5xl uppercase my-2"
          >
            {label}
          </Text>
          <Grid />
          <Text className="font-bold text-5xl uppercase my-2 text-slate-100">
            {score}
          </Text>
          <Text className={infoTextStyle}>
            Your goal is to press the{" "}
            <Text style={colorStyleMap[labelColor]}>square</Text> that matches
            the <Text style={colorStyleMap[labelColor]}>written label</Text>.
            When you click the right color, you score points. When you click the
            wrong color, you lose points!
          </Text>
          <MultiplayerHeader />
          <Text className={infoTextStyle}>
            You can play Stroopwafel against other people! Either host a game by
            creating a room or join a friend's game via code.
          </Text>
          <View className="w-full mx-8 mt-4">
            <Race
              goal={GOAL}
              players={[
                { id: 1, handle: "moop" },
                { id: 2, handle: "boop" },
              ]}
              points={[
                { userId: 1, val: Math.min(score, GOAL) },
                { userId: 2, val: 6 },
              ]}
            />
            <Text
              style={colorStyleMap[colorKey]}
              className="font-bold text-5xl uppercase my-4 text-center"
            >
              {label}
            </Text>
            <Grid />
            {score >= GOAL && (
              <View>
                <Text className="text-yellow-400 text-center text-4xl font-bold my-2">
                  You win!
                </Text>
                <Text
                  className="py-2 px-4 text-xl text-center text-red-200"
                  onPress={() => setScore(0)}
                >
                  Reset
                </Text>
              </View>
            )}
          </View>
          <Text className={infoTextStyle}>
            When you play against others your in a race to see who can get
            through all the words the fastest. First to reach the trophy wins!
          </Text>
        </View>
        <View className="my-4">
          <RegularButton onPress={() => navigation.navigate("Main")}>
            Alright, let's play!
          </RegularButton>
        </View>
      </ScrollView>
    </SafeView>
  );
}

export default HowToPlay;
