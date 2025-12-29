import * as Network from "expo-network";
import { useNetworkStore } from "../store/network.store";
import { syncVentas } from "../db/sync.service";

let lastConnected = true;

export async function initNetworkListener() {
  const initial = await Network.getNetworkStateAsync();
  useNetworkStore.getState().setStatus(
    initial.isConnected ? "online" : "offline"
  );
  lastConnected = !!initial.isConnected;

  // Polling simple (Expo no expone listener continuo)
  setInterval(async () => {
    const state = await Network.getNetworkStateAsync();
    const isConnected = !!state.isConnected;

    if (isConnected && !lastConnected) {
      // 🔄 volvió internet
      useNetworkStore.getState().setStatus("syncing");
      await syncVentas();
      useNetworkStore.getState().setStatus("online");
    }

    if (!isConnected) {
      useNetworkStore.getState().setStatus("offline");
    }

    lastConnected = isConnected;
  }, 3000); // cada 3 segundos
}
