import { InventarioView } from "../models/inventario";
import { Producto } from "../models/product";
import { authFetch } from "./http";

/* ============================
   Obtener inventario
============================ */
export async function getInventario(): Promise<InventarioView[]> {
  return authFetch("/inventario");
}

/* ============================
   Productos con stock
============================ */
export async function getProductosInventario(): Promise<Producto[]> {
  return authFetch("/productos?withStock=true");
}
