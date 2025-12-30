import { View, Text, FlatList, StyleSheet, ScrollView,Pressable } from "react-native";
import { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { getInventario } from "../../src/services/inventario.service";
import type { InventarioView } from "../../src/models/inventario";
import InventarioItemCard from "../../components/Inventario/InventarioItemCard";
import InventarioResumen from "../../components/Inventario/InventarioResumen";
type ProductoStock = {
  productoId: string;
  nombre: string;
  modelo?: string;
  variantes: {
    color: string;
    talla: string;
    stock: number;
  }[];
};

type InventarioResumen = {
  key: string;
  nombre: string;
  modelo?: string;
  color: string;
  talla: string;
  stock: number;
};

function buildStockPorProducto(
  data: InventarioView[]
): ProductoStock[] {
  const map = new Map<string, ProductoStock>();

  data.forEach((mov) => {
    if (!mov.productoId) return;

    const producto = mov.productoId as any;

    if (!map.has(producto._id)) {
      map.set(producto._id, {
        productoId: producto._id,
        nombre: producto.nombre,
        modelo: producto.modelo,
        variantes: [],
      });
    }

    const prod = map.get(producto._id)!;

    const existente = prod.variantes.find(
      (v) =>
        v.color === mov.variante.color &&
        v.talla === mov.variante.talla
    );

    // el último movimiento manda
    if (existente) {
      existente.stock = mov.stockActual;
    } else {
      prod.variantes.push({
        color: mov.variante.color,
        talla: mov.variante.talla,
        stock: mov.stockActual,
      });
    }
  });

  return Array.from(map.values());
}


export default function InventarioScreen() {
  const [stockProductos, setStockProductos] =useState<ProductoStock[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  const [movimientos, setMovimientos] = useState<InventarioView[]>([]);
  const [tipoFiltro, setTipoFiltro] = useState<
  "ALL" | "ENTRADA" | "SALIDA" | "AJUSTE"
>("ALL");

  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const movimientosFiltrados =
  tipoFiltro === "ALL"
    ? movimientos
    : movimientos.filter((m) => m.tipo === tipoFiltro);

  useEffect(() => {
    getInventario()
      .then((data) => {
        setMovimientos(data);
        setStockProductos(buildStockPorProducto(data));
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
      <Stack.Screen
        options={{
          title: "Inventario",
          headerShown: true,
          headerStyle: { backgroundColor: "#3A8DFF" },
          headerTintColor: "#fff",
        }}
      />
        
      {/* 1️⃣ RESUMEN KPI */}
      <InventarioResumen items={movimientos} />

      {/* 2️⃣ STOCK POR PRODUCTO */}

      <Text style={styles.section}>Stock por producto</Text>

        {stockProductos.map((prod) => {
          const abierto = expanded === prod.productoId;

          return (
            <View key={prod.productoId} style={styles.productCard}>
              <Pressable
                onPress={() =>
                  setExpanded(abierto ? null : prod.productoId)
                }
                style={styles.productHeader}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>
                    {prod.nombre} · {prod.modelo}
                  </Text>
                  <Text style={styles.variant}>
                    {prod.variantes.length} variantes
                  </Text>
                </View>

                <Text style={styles.expandIcon}>
                  {abierto ? "▲" : "▼"}
                </Text>
              </Pressable>

              {abierto &&
              prod.variantes.map((v, idx) => (
                <Pressable
                  key={idx}
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/(inventario)/[productoId]",
                      params: {
                        productoId: prod.productoId,
                        color: v.color,
                        talla: v.talla,
                      },
                    })
                  }
                >
                  <View style={styles.variantRow}>
                    <Text>
                      {v.color} · {v.talla}
                    </Text>

                    <Text
                      style={{
                        fontWeight: "700",
                        color:
                          v.stock === 0
                            ? "#C62828"
                            : v.stock <= 5
                            ? "#ED6C02"
                            : "#2E7D32",
                      }}
                    >
                      {v.stock}
                    </Text>
                  </View>
                </Pressable>
              ))}

            </View>
          );
        })}



      {/* 3️⃣ MOVIMIENTOS */}
      <Text style={styles.section}>Movimientos</Text>
      <View style={styles.filters}>
        {["ALL", "ENTRADA", "SALIDA", "AJUSTE"].map((t) => (
          <Pressable
            key={t}
            style={[
              styles.filterBtn,
              tipoFiltro === t && styles.filterActive,
            ]}
            onPress={() => setTipoFiltro(t as any)}
          >
            <Text
              style={{
                color: tipoFiltro === t ? "#fff" : "#333",
                fontWeight: "600",
              }}
            >
              {t}
            </Text>
          </Pressable>
        ))}
        

      </View>
      <Text style={{ marginBottom: 8, color: "#555" }}>
          Mostrando: {tipoFiltro === "ALL" ? "Todos" : tipoFiltro}
        </Text>
      {movimientosFiltrados.map((mov) => (
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
filters: {
  flexDirection: "row",
  marginBottom: 12,
},
filterBtn: {
  paddingVertical: 6,
  paddingHorizontal: 12,
  backgroundColor: "#E9EDF5",
  borderRadius: 20,
  marginRight: 8,
},
filterActive: {
  backgroundColor: "#3A8DFF",
},
productCard: {
  backgroundColor: "#fff",
  borderRadius: 12,
  marginBottom: 12,
  overflow: "hidden",
},

productHeader: {
  flexDirection: "row",
  alignItems: "center",
  padding: 14,
},

expandIcon: {
  fontSize: 16,
  fontWeight: "700",
  color: "#555",
},

variantRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  paddingHorizontal: 16,
  paddingVertical: 10,
  borderTopWidth: 1,
  borderTopColor: "#eee",
},

});
