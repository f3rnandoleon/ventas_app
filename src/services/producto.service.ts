import { Producto } from "../models/product";
import { authFetch } from "./http";
import { API_URL } from "../config/api";

export async function getProductoByCodigo(code: string) {
  return authFetch(`/productos/by-code/${code}`);
}

/* ============================
   Obtener productos
============================ */
export async function getProductos(): Promise<Producto[]> {
  return authFetch("/productos");
}

/* ============================
   Crear producto
============================ */
export async function createProducto(
  data: Partial<Producto>
): Promise<Producto> {
  return authFetch("/productos", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* ============================
   Actualizar producto
============================ */
export async function updateProducto(
  id: string,
  data: Partial<Producto>
): Promise<Producto> {
  return authFetch(`/productos/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/* ============================
   Eliminar producto
============================ */
export async function deleteProducto(id: string) {
  return authFetch(`/productos/${id}`, {
    method: "DELETE",
  });
}
