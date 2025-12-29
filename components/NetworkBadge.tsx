import { View, Text, StyleSheet } from "react-native";
import { useNetworkStore } from "../src/store/network.store";

export default function NetworkBadge() {
  const status = useNetworkStore((s) => s.status);

  let label = "";
  let style = styles.online;

  if (status === "offline") {
    label = "Offline";
    style = styles.offline;
  } else if (status === "syncing") {
    label = "Sincronizando…";
    style = styles.syncing;
  } else {
    label = "Online";
    style = styles.online;
  }

  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  text: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  online: {
    backgroundColor: "#2E7D32",
  },
  offline: {
    backgroundColor: "#ED6C02",
  },
  syncing: {
    backgroundColor: "#1565C0",
  },
});
