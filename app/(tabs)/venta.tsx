import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
} from "react-native";
import { useLocalSearchParams ,useRouter} from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { getProductoByCodigo } from "../../src/services/producto.service";
import { createVenta } from "../../src/services/venta.service";
import type { CreateVentaDTO } from "../../src/models/venta";

type VentaItemUI = {
  productoId: string;
  nombre: string;
  modelo: string;
  color: string;
  talla: string;
  cantidad: number;
  precioUnitario: number;
  stockDisponible: number;
};



export default function VentaScreen() {
  const [items, setItems] = useState<VentaItemUI[]>([]);
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    if (!params?.code) return;

    const code = String(params.code);

    (async () => {
      try {
        const data = await getProductoByCodigo(code);

        const nuevoItem: VentaItemUI = {
          productoId: data._id,
          nombre: data.nombre,
          modelo: data.modelo,
          color: data.variante.color,
          talla: data.variante.talla,
          cantidad: 1,
          precioUnitario: data.precioVenta,
          stockDisponible: data.variante.stock,
        };

        setItems((prev) => {
          const index = prev.findIndex(
            (i) =>
              i.productoId === nuevoItem.productoId &&
              i.color === nuevoItem.color &&
              i.talla === nuevoItem.talla
          );

          // 👉 ya existe → aumentar cantidad
          if (index !== -1) {
            if (prev[index].cantidad + 1 > prev[index].stockDisponible) {
              Alert.alert(
                "Stock insuficiente",
                "No hay más unidades disponibles"
              );
              return prev;
            }

            const copy = [...prev];
            copy[index].cantidad += 1;
            return copy;
          }

          // 👉 nuevo producto
          return [...prev, nuevoItem];
        });
      } catch (err: any) {
        Alert.alert("Error", err.message || "Producto no encontrado");
      }
    })();
  }, [params?.code]);

  const registrarVenta = async () => {
    try {
      const payload: CreateVentaDTO = {
        items: items.map((i) => ({
          productoId: i.productoId,
          color: i.color,
          talla: i.talla,
          cantidad: i.cantidad,
        })),
        metodoPago: "EFECTIVO",
        tipoVenta: "APP_QR",
      };

      await createVenta(payload);

      Alert.alert("Venta registrada", "La venta fue registrada correctamente");
      setItems([]);
    } catch (err: any) {
      Alert.alert("Error", err.message || "No se pudo registrar la venta");
    }
  };

  const total = items.reduce(
    (sum, item) => sum + item.precioUnitario * item.cantidad,
    0
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Text style={styles.title}>Venta rápida</Text>

      {/* BOTÓN ESCANEAR */}
      <Pressable
        style={styles.scanButton}
        onPress={() => router.push("/(tabs)/scanner")}
      >
        <Text style={styles.scanText}>📷 Escanear producto</Text>
      </Pressable>


      {/* LISTA DE PRODUCTOS */}
      {items.length === 0 ? (
        <Text style={styles.empty}>No hay productos agregados</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) =>
            `${item.productoId}-${item.color}-${item.talla}`
          }
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View>
                <Text style={styles.itemName}>
                  {item.nombre} · {item.modelo}
                </Text>
                <Text style={styles.itemVariant}>
                  {item.color} · {item.talla}
                </Text>
              </View>

              <View style={styles.itemRight}>
                <Text>x{item.cantidad}</Text>
                <Text style={styles.itemPrice}>
                  Bs {item.precioUnitario * item.cantidad}
                </Text>
              </View>
            </View>
          )}
        />

      )}

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.total}>Total: Bs {total}</Text>

        <Pressable
          style={styles.payButton}
          onPress={registrarVenta}
          disabled={items.length === 0}
        >
          <Text style={styles.payText}>
            Registrar venta · Bs {total}
          </Text>
        </Pressable>

      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F4F7",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  scanButton: {
    backgroundColor: "#3A8DFF",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  scanText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  empty: {
    textAlign: "center",
    color: "#777",
    marginTop: 40,
  },
  item: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
  },
  itemVariant: {
    color: "#666",
    fontSize: 13,
    marginTop: 2,
  },
  itemRight: {
    alignItems: "flex-end",
  },
  itemPrice: {
    fontWeight: "700",
    marginTop: 4,
  },
  footer: {
    marginTop: "auto",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },
  total: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  payButton: {
    backgroundColor: "#111",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  payText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.5,
  },
});
