import { useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { isLoggedIn } from "../api/auth";
import LoginScreen from "./screens/LoginScreen";
import HabitListScreen from "./screens/HabitListScreen";

export default function Index() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
      const status = await isLoggedIn();
      setLoggedIn(status);
      setCheckingAuth(false);
    })();
  }, []); 

  if (checkingAuth) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  };

  return loggedIn ? <HabitListScreen/> : <LoginScreen/>;
}
