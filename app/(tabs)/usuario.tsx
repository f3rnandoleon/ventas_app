import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { logout, getUser } from "../../src/utils/auth";
import { useEffect, useState } from "react";
import { Usuario } from "../../src/models/usuario";

export default function UsuarioScreen() {
  const router = useRouter();
  const [user, setUser] = useState<Usuario | null>(null);

  useEffect(() => {
    getUser().then(setUser);
  }, []);

  const handleLogout = () => {
    
    Alert.alert(
      "Cerrar sesión",
      "¿Deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Salir",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/(auth)/login");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Usuario",
          headerShown: true,
          headerStyle: { backgroundColor: "#3A8DFF" },
          headerTintColor: "#fff",
        }}
      />
      <View style={styles.card}>
        <Text style={styles.name}>{user?.fullname}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.role}>Rol: {user?.role}</Text>
      </View>

      <Pressable style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F2F4F7",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
  },
  email: {
    marginTop: 6,
    color: "#555",
  },
  role: {
    marginTop: 10,
    fontWeight: "600",
    color: "#3A8DFF",
  },
  logoutBtn: {
    backgroundColor: "#E53935",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
