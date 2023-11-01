import { useEffect, useState, useRef } from "react";
import { View, Animated, Text } from "react-native";
import { avatarColor } from "@/utils/profile";
import { MULTIPLAYER_SCORE_TO_WIN } from "@/game";

function PlayerPosition({ handle, pos, goal, width }) {
  const avatarStyle = avatarColor(handle);
  const shift = Math.round((pos / goal) * width * 0.82);
  const translation = useRef(new Animated.Value(shift)).current;

  useEffect(() => {
    Animated.timing(translation, {
      toValue: shift,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [pos, width]);

  if (!width) {
    return <Text>...</Text>;
  }

  return (
    <Animated.View
      className={`${avatarStyle} absolute  w-12 h-12 rounded-full`}
      style={{ transform: [{ translateX: translation }] }}
    />
  );
}

function extractPlayerPoints(points, playerId) {
  return points.find((point) => point.userId === playerId).val;
}

export default function Race({
  players,
  points,
  goal = MULTIPLAYER_SCORE_TO_WIN,
}) {
  const [width, setWidth] = useState(null);
  const hasWidthBeenSet = useRef(false);

  const handleLayout = (event) => {
    if (!hasWidthBeenSet.current) {
      const { width } = event.nativeEvent.layout;
      setWidth(width);
      hasWidthBeenSet.current = true;
    }
  };

  return (
    <View onLayout={handleLayout}>
      <View className="flex-row items-start h-12">
        {players.map((p) => (
          <PlayerPosition
            key={p.id}
            handle={p.handle}
            width={width}
            pos={extractPlayerPoints(points, p.id)}
            goal={goal}
          />
        ))}
      </View>
      <Text className="text-5xl text-right pt-4">🏆</Text>
    </View>
  );
}
