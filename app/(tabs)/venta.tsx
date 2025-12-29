import * as Network from "expo-network";
import { saveVentaOffline } from "../../src/db/ventas.repository";
import { syncVentas } from "../../src/db/sync.service";
import NetworkBadge from "../../components/NetworkBadge";
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
import {
  loadSounds,
  playSuccessFeedback,
  playWarningFeedback,
  playErrorFeedback,
} from "../../src/utils/feedback";
import { useVentaStore } from "../../src/store/venta.store";


export default function VentaScreen() {
  
  const router = useRouter();
  const params = useLocalSearchParams();
  const items = useVentaStore((s) => s.items);
  const clearVenta = useVentaStore((s) => s.clear);
  const [toast, setToast] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);
  const showToast = (
    type: "success" | "error" | "warning",
    message: string
  ) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 1500);
  };
  useEffect(() => {
    loadSounds();
  }, []);
const aumentarCantidad = (index: number) => {
    useVentaStore.setState((state) => {
      const copy = [...state.items];
      if (copy[index].cantidad + 1 > copy[index].stockDisponible) {
        Alert.alert("Stock insuficiente");
        return state;
      }
      copy[index].cantidad += 1;
      return { items: copy };
    });
  };

  const disminuirCantidad = (index: number) => {
    useVentaStore.setState((state) => {
      const copy = [...state.items];
      if (copy[index].cantidad > 1) {
        copy[index].cantidad -= 1;
      }
      return { items: copy };
    });
  };

  const eliminarItem = (index: number) => {
    useVentaStore.setState((state) => ({
      items: state.items.filter((_, i) => i !== index),
    }));
  };

  const registrarVenta = async () => {
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

    const network = await Network.getNetworkStateAsync();

    if (!network.isConnected) {
      await saveVentaOffline(payload);
      clearVenta();
      Alert.alert(
        "Venta guardada",
        "Modo offline. Se sincronizará automáticamente."
      );
      return;
    }

    try {
      await createVenta(payload);
      clearVenta();
      await syncVentas();
      Alert.alert("Venta registrada correctamente");
    } catch {
      await saveVentaOffline(payload);
      clearVenta();
      Alert.alert(
        "Venta guardada",
        "Error de red. Se sincronizará luego."
      );
    }
  };



  const total = items.reduce(
    (sum, item) => sum + item.precioUnitario * item.cantidad,
    0
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        <Text style={styles.title}>Venta rápida</Text>
        <View style={{ marginLeft: 12 }}>
          <NetworkBadge />
        </View>
      </View>

      {/* BOTÓN ESCANEAR */}
      <Pressable
        style={styles.scanButton}
        onPress={() => router.push("/(tabs)/(stack)/scanner")}
      >
        <Text style={styles.scanText}>📷 Escanear producto</Text>
      </Pressable>
      <Pressable
        style={[styles.scanButton, { backgroundColor: "#6B7280" }]}
        onPress={() => router.push("/(tabs)/(stack)/add-product")}
      >
        <Text style={styles.scanText}>➕ Agregar producto manual</Text>
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
          renderItem={({ item, index }) => (
            <View style={styles.item}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>
                  {item.nombre} · {item.modelo}
                </Text>
                <Text style={styles.itemVariant}>
                  {item.color} · {item.talla}
                </Text>

                <View style={styles.controls}>
                  <Pressable
                    style={styles.controlBtn}
                    onPress={() => disminuirCantidad(index)}
                  >
                    <Text style={styles.controlText}>−</Text>
                  </Pressable>

                  <Text style={styles.qty}>{item.cantidad}</Text>

                  <Pressable
                    style={styles.controlBtn}
                    onPress={() => aumentarCantidad(index)}
                  >
                    <Text style={styles.controlText}>+</Text>
                  </Pressable>

                  <Pressable
                    style={styles.deleteBtn}
                    onPress={() => eliminarItem(index)}
                  >
                    <Text style={styles.deleteText}>🗑️</Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.itemRight}>
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
          style={[styles.payButton, items.length === 0 && styles.disabled]}
          onPress={registrarVenta}
          disabled={items.length === 0}
        >
          <Text style={styles.payText}>
            Registrar venta · Bs {total}
          </Text>
        </Pressable>
        

      </View>
      {toast && (
      <View
        style={[
          styles.toast,
          toast.type === "success" && styles.toastSuccess,
          toast.type === "error" && styles.toastError,
          toast.type === "warning" && styles.toastWarning,
        ]}
      >
        <Text style={styles.toastText}>{toast.message}</Text>
      </View>
    )}

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
  controls: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 8,
},
controlBtn: {
  width: 32,
  height: 32,
  borderRadius: 8,
  backgroundColor: "#E9EDF5",
  justifyContent: "center",
  alignItems: "center",
},
controlText: {
  fontSize: 18,
  fontWeight: "700",
},
qty: {
  marginHorizontal: 10,
  fontSize: 16,
  fontWeight: "600",
},
deleteBtn: {
  marginLeft: 12,
},
deleteText: {
  fontSize: 18,
},
toast: {
  position: "absolute",
  bottom: 110,
  alignSelf: "center",
  paddingHorizontal: 16,
  paddingVertical: 10,
  borderRadius: 12,
},
toastText: {
  color: "#fff",
  fontWeight: "600",
},
toastSuccess: {
  backgroundColor: "#2E7D32",
},
toastError: {
  backgroundColor: "#C62828",
},
toastWarning: {
  backgroundColor: "#ED6C02",
},

});
