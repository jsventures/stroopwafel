import {
  TouchableOpacity,
  View,
  Text,
  TextInput,
  Animated,
} from "react-native";
import { transact, tx } from "@instantdb/react-native";
import React, { useState, useRef, useEffect, useContext } from "react";

import SafeView from "@/components/shared/SafeView";
import randomHandle from "@/utils/randomHandle";
import { isAlphanumeric } from "@/utils/string";
import {
  primaryBackgroundColor as bgColor,
  regularButtonStyle,
  infoTextColor as textColor,
} from "@/components/shared/styles";
import { UserContext } from "@/Context";

const textStyle = "text-4xl text-center";

const violet100 = "rgb(237 233 254);";
const red300 = "rgb(252, 165, 165)";
const validColor = violet100;
const invalidColor = red300;

function isValidHandle(handle) {
  return handle.length > 2 && handle.length < 17 && isAlphanumeric(handle);
}

function SaveHandleButton({ handle, onPress }) {
  const isValid = isValidHandle(handle);
  const animatedValue = useRef(new Animated.Value(isValid ? 0 : 1)).current;
  const interpolatedBackgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [validColor, invalidColor],
  });
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isValid ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isValid]);

  return (
    <TouchableOpacity
      disabled={!isValid}
      className={`${regularButtonStyle} my-4`}
      style={{
        backgroundColor: interpolatedBackgroundColor,
        shadowColor: "#6200EA",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        opacity: 0.8,
      }}
      onPress={onPress}
    >
      <Text className={`${textStyle}`}>Save</Text>
    </TouchableOpacity>
  );
}

function Settings({ navigation }) {
  const user = useContext(UserContext);
  const [handle, setHandle] = useState(user.handle || randomHandle());
  const handleSave = () => {
    transact(tx.users[user.id].update({ handle }));
    navigation.navigate("Main");
  };
  return (
    <SafeView className={`flex-1 items-center ${bgColor}`}>
      <View className="flex-1 w-full px-8">
        <View className="flex-1 justify-end">
          <Text
            className={`text-2xl font-semibold my-4 text-center ${textColor}`}
          >
            Enter name
          </Text>
          <TextInput
            autoCorrect={false}
            className={`h-20 p-2 text-4xl text-center border-4 border-amber-400 ${textColor} font-semibold`}
            onChangeText={setHandle}
            value={handle}
          />
        </View>
        <View className="flex-1 justify-end">
          <SaveHandleButton handle={handle} onPress={handleSave} />
        </View>
      </View>
    </SafeView>
  );
}

export default Settings;
