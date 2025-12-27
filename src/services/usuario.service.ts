import { Usuario, CreateUsuarioDTO, UpdateUsuarioDTO } from "../models/usuario";
import { authFetch } from "./http";
import { publicFetch } from "./http";
/* ============================
   Login
============================ */
export async function loginUsuario(
  email: string,
  password: string
) {
  return publicFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
/* ============================
   Obtener usuarios
============================ */
export async function getUsuarios(): Promise<Usuario[]> {
  return authFetch("/usuarios");
}

/* ============================
   Crear usuario
============================ */
export async function createUsuario(data: CreateUsuarioDTO) {
  return authFetch("/usuarios", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* ============================
   Actualizar usuario
============================ */
export async function updateUsuario(
  id: string,
  data: UpdateUsuarioDTO
) {
  return authFetch(`/usuarios/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
