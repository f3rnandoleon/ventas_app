import { View, Text, FlatList, StyleSheet, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { getInventario } from "../../src/services/inventario.service";
import type { InventarioView } from "../../src/models/inventario";
import InventarioItemCard from "../../components/Inventario/InventarioItemCard";
import InventarioResumen from "../../components/Inventario/InventarioResumen";

type InventarioResumen = {
  key: string;
  nombre: string;
  modelo?: string;
  color: string;
  talla: string;
  stock: number;
};

function buildResumen(data: InventarioView[]): InventarioResumen[] {
  const map = new Map<string, InventarioResumen>();

  data.forEach((mov) => {
    if (!mov.productoId) return;

    const producto = mov.productoId as any;

    const key = `${producto._id}-${mov.variante.color}-${mov.variante.talla}`;

    // El último movimiento manda
    map.set(key, {
      key,
      nombre: producto.nombre,
      modelo: producto.modelo,
      color: mov.variante.color,
      talla: mov.variante.talla,
      stock: mov.stockActual,
    });
  });

  const result = Array.from(map.values());

  return result;
}

export default function InventarioScreen() {
  const [resumen, setResumen] = useState<InventarioResumen[]>([]);
  const [movimientos, setMovimientos] = useState<InventarioView[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInventario()
      .then((data) => {
        setMovimientos(data);
        setResumen(buildResumen(data));
      })
      .finally(() => setLoading(false));
  }, []);


  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Cargando inventario…</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      
      {/* 1️⃣ RESUMEN KPI */}
      <InventarioResumen items={movimientos} />

      {/* 2️⃣ STOCK POR PRODUCTO */}
      <Text style={styles.section}>Stock por producto</Text>

      {resumen.map((item) => (
        <View key={item.key} style={styles.card}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>
              {item.nombre} · {item.modelo}
            </Text>
            <Text style={styles.variant}>
              {item.color} · {item.talla}
            </Text>
          </View>

          <Text
            style={[
              styles.stock,
              {
                color:
                  item.stock === 0
                    ? "#C62828"
                    : item.stock <= 5
                    ? "#ED6C02"
                    : "#2E7D32",
              },
            ]}
          >
            {item.stock}
          </Text>
        </View>
      ))}

      {/* 3️⃣ MOVIMIENTOS */}
      <Text style={styles.section}>Movimientos</Text>

      {movimientos.map((mov) => (
        <InventarioItemCard key={mov._id} item={mov} />
      ))}
    </ScrollView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1, // 🔴 CLAVE
    backgroundColor: "#F2F4F7",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
  },
  variant: {
    color: "#555",
    marginTop: 2,
  },
  stock: {
    fontSize: 18,
    fontWeight: "700",
  },
  section: {
  fontSize: 18,
  fontWeight: "700",
  marginVertical: 12,
},

});
