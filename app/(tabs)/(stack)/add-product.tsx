import { View, Text, TextInput, FlatList, Pressable, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { getProductos } from "../../../src/services/producto.service";
import { useVentaStore } from "../../../src/store/venta.store";
import {
  playSuccessFeedback,
  playWarningFeedback,
} from "../../../src/utils/feedback";
import { Stack } from "expo-router";

export default function AddProductScreen() {
  const router = useRouter();
  const addItem = useVentaStore((s) => s.addItem);

  const [query, setQuery] = useState("");
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const buscar = async () => {
    setLoading(true);
    try {
      const data = await getProductos();
      setProductos(
        data.filter((p: any) =>
          `${p.nombre} ${p.modelo} ${p.sku}`
            .toLowerCase()
            .includes(query.toLowerCase())
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const agregar = (p: any, v: any) => {
    if (v.stock === 0) {
      playWarningFeedback();
      alert(
        "Sin stock"
      );
      return;
    }

    const result = addItem({
      productoId: p._id,
      nombre: p.nombre,
      modelo: p.modelo,
      color: v.color,
      talla: v.talla,
      cantidad: 1,
      precioUnitario: p.precioVenta,
      stockDisponible: v.stock,
    });

    if (result === "stock") {
      playWarningFeedback();
    } else {
      playSuccessFeedback();
      router.replace("/(tabs)/venta");
    }
  };


  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Agregar producto",
          headerLeft: () => (
            <Pressable onPress={() => router.replace("/(tabs)/venta")}>
              <Text style={{ color: "#fff",fontSize:30, }}>↩</Text>
            </Pressable>
          ),
        }}
      />



      <TextInput
        style={styles.input}
        placeholder="Buscar por nombre, modelo o SKU"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={buscar}
      />

      <FlatList
        data={productos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.product}>
            <Text style={styles.name}>
              {item.nombre} · {item.modelo}
            </Text>

            {item.variantes.map((v: any) => (
              <Pressable
                key={`${v.color}-${v.talla}`}
                style={[
                  styles.variant,
                  v.stock === 0 && styles.variantDisabled,
                ]}
                disabled={v.stock === 0}
                onPress={() => agregar(item, v)}
              >

                <Text>
                  {v.color} · {v.talla} · Stock {v.stock}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      />

      <Pressable style={styles.close} onPress={() => router.push("/(tabs)/venta")}>
        <Text style={styles.closeText}>Cerrar</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F2F4F7",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  product: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  name: {
    fontWeight: "600",
    marginBottom: 6,
  },
  variant: {
    paddingVertical: 6,
  },
  close: {
    marginTop: "auto",
    backgroundColor: "#111",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  closeText: {
    color: "#fff",
    fontWeight: "600",
  },
  variantDisabled: {
  opacity: 0.4,
},

});
