import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { init, useQuery, transact, tx, id } from "@instantdb/react-native";

import { UserContext } from "@/Context";
import AppNavigator, { DEEP_LINKS_CONFIG } from "@/Navigator";
import randomHandle from "@/utils/randomHandle";
import {
  LoadingPlaceholder,
  ErrorPlaceholder,
} from "@/components/shared/Placeholder";
import { now } from "./utils/time";

// Consts
// ------------------
const USER_ID_KEY = "USER_ID_KEY";

// Instant init
// ------------------
const APP_ID = "CHANGE_ME";

init({
  appId: APP_ID,
  websocketURI: "wss://api.instantdb.com/runtime/session",
});

// App
// ------------------
function App() {
  const [userId, setUserId] = useState(null);

  // Create a new userId if didn't have one saved previously
  useEffect(() => {
    const fetchOrSetUserId = async () => {
      let storageUserId = await AsyncStorage.getItem(USER_ID_KEY);

      if (!storageUserId) {
        storageUserId = id();
        await AsyncStorage.setItem(USER_ID_KEY, storageUserId);
      }

      setUserId(storageUserId);
    };

    fetchOrSetUserId();
  }, []);

  if (userId === null) return <LoadingPlaceholder />;
  return <AppUser userId={userId} />;
}

function AppUser({ userId }) {
  const { isLoading, error, data } = useQuery({
    users: { $: { where: { id: userId } } },
  });
  const [userExists, setUserExists] = useState(false);

  // Create user if they don't exist
  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (data.users.length == 0) {
      transact(
        tx.users[userId].update({
          handle: randomHandle(),
          highScore: 0,
          created_at: now(),
        })
      );
    }
    setUserExists(true);
    return () => null;
  }, [isLoading, data]);
  if (isLoading || !userExists) return <LoadingPlaceholder />;
  if (error) return <ErrorPlaceholder error={error} />;
  const user = data.users[0];

  return (
    <SafeAreaProvider>
      <UserContext.Provider value={user}>
        <NavigationContainer
          linking={DEEP_LINKS_CONFIG}
          fallback={<LoadingPlaceholder />}
        >
          <AppNavigator user={user} />
        </NavigationContainer>
      </UserContext.Provider>
    </SafeAreaProvider>
  );
}

export default App;
