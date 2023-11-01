import { HeaderBackButton } from "@react-navigation/elements";
import { createStackNavigator } from "@react-navigation/stack";
import { LogBox } from "react-native";
import { createURL } from "expo-linking";

import {
  GameOverMultiplayer,
  GameOverSingleplayer,
  HowToPlay,
  JoinRoom,
  Main,
  Multiplayer,
  Settings,
  Singleplayer,
  WaitingRoom,
} from "@/components/scenes";
import { HEADER_TINT_COLOR } from "./components/shared/styles";

// (XXX): React-Navigation sends noisy warnings. Let's disable it
// See: https://github.com/react-navigation/react-navigation/issues/7839
LogBox.ignoreLogs([
  "Sending `onAnimatedValueUpdate` with no listeners registered.",
]);
const DEFAULT_SCENE = "Main";
export const DEEP_LINKS_CONFIG = {
  prefixes: [createURL("/"), "https://stroopwafel.app"],
  config: {
    screens: {
      Main: "main",
      SinglePlayer: "play/:resetGame",
      GameOverSinglePlayer: {
        path: "play/over/:score",
        parse: { score: Number },
      },
      WaitingRoom: "room/:code",
      JoinRoom: "join/:code",
      Mulitplayer: "game/:gameId",
      GameOverMultiPlayer: "game/:gameId/over",
      HowToPlay: "rules",
      Settings: "settings",
      Main: "*",
    },
  },
};

const Stack = createStackNavigator();
export default function Navigator({ user }) {
  return (
    <Stack.Navigator
      initialRouteName={DEFAULT_SCENE}
      screenOptions={{
        gestureEnabled: false,
        headerStyle: {
          backgroundColor: "#7c3aed",
        },
        headerTintColor: HEADER_TINT_COLOR,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        options={{ headerShown: false }}
        component={Main}
        name="Main"
      />
      <Stack.Screen
        name="Singleplayer"
        options={{ headerShown: false }}
        component={Singleplayer}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="GameOverSingleplayer"
        component={GameOverSingleplayer}
      />
      <Stack.Screen
        name="WaitingRoom"
        options={({ route }) => ({
          title: route.params.code,
          // Add a placeholder without onPress to avoid flicker
          headerLeft: () => (
            <HeaderBackButton tintColor={HEADER_TINT_COLOR} label="Leave" />
          ),
        })}
        component={WaitingRoom}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Multiplayer"
        component={Multiplayer}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="GameOverMultiplayer"
        component={GameOverMultiplayer}
      />
      <Stack.Screen
        name="JoinRoom"
        options={{ title: "Join Room", headerBackTitle: "Back" }}
        component={JoinRoom}
      />
      <Stack.Screen
        name="HowToPlay"
        options={{ title: "How to Play", headerBackTitle: "Back" }}
        component={HowToPlay}
      />
      <Stack.Screen
        name="Settings"
        options={{ title: "Set Name", headerBackTitle: "Back" }}
        component={Settings}
      />
    </Stack.Navigator>
  );
}
