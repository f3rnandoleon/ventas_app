import { View, Text, StyleSheet } from "react-native";
import type { InventarioView } from "../..//src/models/inventario";

export default function InventarioItemCard({ item }: { item: InventarioView }) {
  const color =
    item.tipo === "ENTRADA"
      ? "#2E7D32"
      : item.tipo === "SALIDA"
      ? "#C62828"
      : "#ED6C02";

  return (
    <View style={styles.card}>
      <Text style={styles.date}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>

      <Text style={styles.name}>
        {item.productoId.nombre} · {item.productoId.modelo}
      </Text>

      <Text style={styles.variant}>
        {item.variante.color} / {item.variante.talla}
      </Text>

      <View style={styles.row}>
        <Text style={[styles.tipo, { color }]}>{item.tipo}</Text>
        <Text>
          {item.stockAnterior} →{" "}
          <Text style={{ color: "#22d3ee" }}>
            {item.stockActual}
          </Text>
        </Text>
      </View>

      <Text style={styles.user}>
        {item.usuario?.fullname || "Sistema"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  date: {
    fontSize: 11,
    color: "#777",
  },
  name: {
    fontWeight: "700",
    marginTop: 4,
  },
  variant: {
    color: "#555",
    marginTop: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  tipo: {
    fontWeight: "700",
  },
  user: {
    marginTop: 6,
    fontSize: 12,
    color: "#777",
  },
});
