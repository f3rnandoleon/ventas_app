import { View, Text, StyleSheet } from "react-native";
import type { InventarioView } from "../../src/models/inventario";

export default function InventarioResumen({
  items,
}: {
  items: InventarioView[];
}) {
  const entradas = items.filter(i => i.tipo === "ENTRADA").length;
  const salidas = items.filter(i => i.tipo === "SALIDA").length;
  const ajustes = items.filter(i => i.tipo === "AJUSTE").length;

  return (
    <View style={styles.row}>
      <Card title="Entradas" value={entradas} color="#2E7D32" />
      <Card title="Salidas" value={salidas} color="#C62828" />
      <Card title="Ajustes" value={ajustes} color="#ED6C02" />
    </View>
  );
}

function Card({ title, value, color }: any) {
  return (
    <View style={[styles.card, { borderColor: color }]}>
      <Text style={styles.label}>{title}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
  },
  label: {
    color: "#666",
    fontSize: 12,
  },
  value: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 6,
  },
});
