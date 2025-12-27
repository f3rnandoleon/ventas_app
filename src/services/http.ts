import * as SecureStore from "expo-secure-store";
import { API_URL } from "../config/api";

export async function authFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = await SecureStore.getItemAsync("token");

  if (!token) {
    throw new Error("Token no proporcionado");
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error en la petición");
  }

  return res.json();
}

export async function publicFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error en la petición");
  }

  return res.json();
}
