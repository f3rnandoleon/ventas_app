import * as Network from "expo-network";
import { getPendingVentas, markVentaAsSynced } from "./ventas.repository";
import { createVenta } from "../services/venta.service";

export async function syncVentas() {
  const network = await Network.getNetworkStateAsync();
  if (!network.isConnected) return;

  const pendientes = await getPendingVentas();

  for (const venta of pendientes) {
    try {
      await createVenta(JSON.parse(venta.payload));
      await markVentaAsSynced(venta.id);
    } catch {
      // se reintentará luego
    }
  }
}
