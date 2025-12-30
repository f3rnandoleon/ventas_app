import { View, Text, StyleSheet,ScrollView, Pressable } from "react-native";
import { Stack, useLocalSearchParams,useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getInventario } from "../../../src/services/inventario.service";
import type { InventarioView } from "../../../src/models/inventario";
import InventarioItemCard from "../../../components/Inventario/InventarioItemCard";

type KardexPorVariante = {
  key: string;
  color: string;
  talla: string;
  movimientos: InventarioView[];
};

export default function KardexProductoScreen() {
  const { productoId } = useLocalSearchParams();
  const [variantes, setVariantes] = useState<KardexPorVariante[]>([]);
  const [producto, setProducto] = useState<{
    nombre: string;
    modelo?: string;
  } | null>(null);
  const router=useRouter();
  useEffect(() => {
    getInventario().then((data) => {
      const filtrados = data.filter(
        (i) => i.productoId?._id === productoId
      );

      if (filtrados.length > 0) {
        setProducto({
          nombre: filtrados[0].productoId.nombre,
          modelo: filtrados[0].productoId.modelo,
        });
      }

      const map = new Map<string, KardexPorVariante>();

      filtrados.forEach((mov) => {
        const key = `${mov.variante.color}-${mov.variante.talla}`;

        if (!map.has(key)) {
          map.set(key, {
            key,
            color: mov.variante.color,
            talla: mov.variante.talla,
            movimientos: [],
          });
        }

        map.get(key)!.movimientos.push(mov);
      });

      // ordenar movimientos por fecha DESC
      map.forEach((v) =>
        v.movimientos.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )
      );

      setVariantes(Array.from(map.values()));
    });
  }, [productoId]);

  return (
    
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <Stack.Screen
        options={{
          title: "Kardex de Producto",
          headerLeft: () => (
            <Pressable onPress={() => router.replace("/(tabs)/inventario")}>
              <Text style={{ color: "#fff",fontSize:30,marginRight:10 }}>↩</Text>
            </Pressable>
          ),
        }}
      />
      {producto && (
        <View style={styles.header}>
          <Text style={styles.title}>
            Producto: {producto.nombre} · {producto.modelo}
          </Text>
          <Text style={styles.subtitle}>Kardex por variante</Text>
        </View>
      )}

      {variantes.map((v) => (
        <View key={v.key} style={styles.variantBlock}>
          <Text style={styles.variantTitle}>
            {v.color} · {v.talla}
          </Text>

          {v.movimientos.map((mov) => (
            <InventarioItemCard key={mov._id} item={mov} />
          ))}
        </View>
      ))}

      {variantes.length === 0 && (
        <Text style={styles.empty}>
          No hay movimientos para este producto
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F2F4F7",
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    color: "#666",
    marginTop: 2,
  },
  variantBlock: {
    marginBottom: 20,
  },
  variantTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#777",
  },
});
