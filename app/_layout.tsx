import { Stack } from "expo-router";
import { useEffect } from "react";
import { initDB } from "../src/db/database";
import { syncVentas } from "../src/db/sync.service";
import { initNetworkListener } from "../src/services/network.service";


export default function RootLayout() {
  useEffect(() => {
    initDB();
    syncVentas();
    initNetworkListener();

  }, []);
  return <Stack screenOptions={{ headerShown: false }} />;
}
