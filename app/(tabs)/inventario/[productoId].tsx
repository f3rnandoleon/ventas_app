import { View, Text, FlatList, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { getInventario } from "../../../src/services/inventario.service";
import type { InventarioView } from "../../../src/models/inventario";
import InventarioItemCard from "../../../components/Inventario/InventarioItemCard";

export default function KardexProductoScreen() {
  const { productoId } = useLocalSearchParams();
  const [items, setItems] = useState<InventarioView[]>([]);

  useEffect(() => {
    getInventario().then((data) => {
      const filtrados = data.filter(
        (i) => i.productoId?._id === productoId
      );
      setItems(filtrados);
    });
  }, [productoId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kardex del producto</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <InventarioItemCard item={item} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F2F4F7" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
});
