import { View, Text, StyleSheet } from "react-native";

export function StockBar({
  nombre,
  stock,
  max = 10,
}: {
  nombre: string;
  stock: number;
  max?: number;
}) {
  const percent = Math.min(stock / max, 1);

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{nombre}</Text>

      <View style={styles.barBg}>
        <View
          style={[
            styles.barFill,
            {
              width: `${percent * 100}%`,
              backgroundColor:
                stock === 0
                  ? "#C62828"
                  : stock <= 5
                  ? "#ED6C02"
                  : "#2E7D32",
            },
          ]}
        />
      </View>

      <Text style={styles.stock}>Stock: {stock}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  name: {
    fontWeight: "600",
    marginBottom: 6,
  },
  barBg: {
    height: 8,
    backgroundColor: "#eee",
    borderRadius: 6,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
  },
  stock: {
    marginTop: 6,
    fontSize: 12,
    color: "#555",
  },
});
