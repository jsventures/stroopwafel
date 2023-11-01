import { Text, TouchableOpacity, View } from "react-native";

export const primaryBackgroundColor = "bg-violet-600";
export const primaryTextColor = "text-slate-800";
export const infoTextColor = "text-yellow-400";
export const primaryButtonBackgroundColor = "bg-violet-100";
export const HEADER_TINT_COLOR = "#facc15";

export const regularButtonStyle = `h-24 ${primaryButtonBackgroundColor} rounded-xl justify-center my-2`;
const halfButtonStyle = `h-24 ${primaryButtonBackgroundColor} rounded-xl justify-center px-4`;
const primaryText = `text-4xl text-center font-semibold ${primaryTextColor}`;

export function RegularButton({ onPress, children, props }) {
  return (
    <TouchableOpacity
      className={`${regularButtonStyle}`}
      style={{
        shadowColor: "#6200EA",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        opacity: 0.8,
      }}
      onPress={onPress}
    >
      <Text className={`${primaryText}`}>{children}</Text>
    </TouchableOpacity>
  );
}

export function HalfButton({ onPress, children }) {
  return (
    <TouchableOpacity
      className={`${halfButtonStyle}`}
      style={{
        shadowColor: "#6200EA",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        opacity: 0.8,
      }}
      onPress={onPress}
    >
      <View>
        <Text className={`${primaryText}`}>{children}</Text>
      </View>
    </TouchableOpacity>
  );
}
