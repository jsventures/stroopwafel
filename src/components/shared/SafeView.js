import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function SafeView({ children, style, ...props }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

export default SafeView;
