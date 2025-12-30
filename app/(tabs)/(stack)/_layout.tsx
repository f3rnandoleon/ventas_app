import { Stack,useRouter } from "expo-router";
import { Pressable, Text } from "react-native";

export default function StackLayout() {
  const router=useRouter();
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#3A8DFF",
        },
        headerTintColor: "#fff",
      }}
    >
      {/* SCANNER COMO MODAL */}
      <Stack.Screen
        name="scanner"
        options={{
          title: "Escanear producto",
            headerLeft: () => (
              <Pressable onPress={() => router.replace("/(tabs)/venta")}>
                <Text style={{ color: "#fff", fontSize:30 ,marginRight:10}}>↩</Text>
              </Pressable>
            ),          
        }}
      />

      {/* AGREGAR PRODUCTO MANUAL */}
      <Stack.Screen
        name="add-product"
        options={{
          title: "Agregar producto",
          presentation: "modal", // 🔥
          headerLeft: () => (
            <Pressable onPress={() => router.replace("/(tabs)/venta")}>
              <Text style={{ color: "#fff",fontSize:30,marginRight:10 }}>↩</Text>
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}
