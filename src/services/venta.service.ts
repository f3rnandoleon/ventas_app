import { Venta, CreateVentaDTO } from "../models/venta";
import { authFetch } from "./http";

/* ============================
   Crear venta
============================ */
export async function createVenta(data: CreateVentaDTO) {
  return authFetch("/ventas", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* ============================
   Obtener ventas
============================ */
export async function getVentas(): Promise<Venta[]> {
  return authFetch("/ventas");
}
