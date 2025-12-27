import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "../src/hooks/useAuth";

export default function Index() {
  const { authenticated } = useAuth();

  if (authenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return authenticated ? (
    <Redirect href="/(tabs)/venta" />
  ) : (
    <Redirect href="/(auth)/login" />
  );
}
