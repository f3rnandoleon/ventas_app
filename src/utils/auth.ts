import * as SecureStore from "expo-secure-store";
import { Usuario } from "../models/usuario";

export async function saveSession(token: unknown, user: Usuario | undefined) {
  if (!token || typeof token !== "string") {
    throw new Error("Token inválido recibido del servidor");
  }

  if (!user) {
    throw new Error("Usuario inválido recibido del servidor");
  }

  await SecureStore.setItemAsync("token", token);
  await SecureStore.setItemAsync("user", JSON.stringify(user));
}

export async function getToken() {
  return SecureStore.getItemAsync("token");
}

export async function getUser(): Promise<Usuario | null> {
  const data = await SecureStore.getItemAsync("user");
  return data ? JSON.parse(data) : null;
}

export async function logout() {
  await SecureStore.deleteItemAsync("token");
  await SecureStore.deleteItemAsync("user");
}
