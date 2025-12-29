import { View, Text, StyleSheet, Pressable } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useRef,useState } from "react";
import { Stack } from "expo-router";
import { getProductoByCodigo } from "../../../src/services/producto.service";
import { useVentaStore } from "../../../src/store/venta.store";
import {
  playSuccessFeedback,
  playWarningFeedback,
  playErrorFeedback,
} from "../../../src/utils/feedback";
export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const lastScanRef = useRef<number>(0);
  const addItem = useVentaStore((s) => s.addItem);
  const [flash, setFlash] = useState<"off" | "on">("off");
  const [focusPoint, setFocusPoint] = useState<{ x: number; y: number } | null>(
  null
);
  const [scanStatus, setScanStatus] = useState<
    "idle" | "success" | "warning" | "error"
  >("idle");

  const [scanMessage, setScanMessage] = useState<string>("");
  const lastScanTimeRef = useRef<number>(0);
  const lastCodeRef = useRef<string | null>(null);

  if (!permission) {
    return <Text>Solicitando permisos...</Text>;
  }
  const showScanFeedback = (
    status: "success" | "warning" | "error",
    message: string
  ) => {
    setScanStatus(status);
    setScanMessage(message);

    setTimeout(() => {
      setScanStatus("idle");
      setScanMessage("");
    }, 1200);
  };

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Se necesita acceso a la cámara</Text>
        <Pressable style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Permitir cámara</Text>
        </Pressable>
      </View>
    );
  }

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    const now = Date.now();

    // ⏱️ 1️⃣ tiempo mínimo entre escaneos (2 segundos)
    if (now - lastScanTimeRef.current < 1000) {
      return;
    }

    // 🔒 2️⃣ mismo código no se vuelve a procesar
    if (data === lastCodeRef.current) {
      return;
    }

    lastScanTimeRef.current = now;
    lastCodeRef.current = data;

    try {
      const res = await getProductoByCodigo(data);

      const result = addItem({
        productoId: res._id,
        nombre: res.nombre,
        modelo: res.modelo,
        color: res.variante.color,
        talla: res.variante.talla,
        cantidad: 1,
        precioUnitario: res.precioVenta,
        stockDisponible: res.variante.stock,
      });

      if (result === "stock") {
        playWarningFeedback();
        showScanFeedback("warning", "Stock insuficiente");
      } else {
        playSuccessFeedback();
        showScanFeedback("success", "Producto agregado");
      }
    } catch {
      playErrorFeedback();
      showScanFeedback("error", "Producto no existente");
    }

    // 🔓 liberar bloqueo del código después de 2s
    setTimeout(() => {
      lastCodeRef.current = null;
    }, 2000);
  };




  return (
    <View style={styles.container}>
        <Stack.Screen
          options={{
            title: "Escanear producto",
            headerLeft: () => (
              <Pressable onPress={() => router.replace("/(tabs)/venta")}>
                <Text style={{ color: "#fff", fontSize:30 }}>↩</Text>
              </Pressable>
            ),
          }}
        />



      <Pressable
        style={StyleSheet.absoluteFillObject}
        onPress={(e) => {
          const { locationX, locationY } = e.nativeEvent;
          setFocusPoint({ x: locationX, y: locationY });

          // 🔁 feedback visual temporal
          setTimeout(() => setFocusPoint(null), 800);
        }}
      >
        
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          enableTorch={flash === "on"}
          autofocus="on"   // 🔍 autofocus activo
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "ean13", "ean8", "code128", "code39"],
          }}
          onBarcodeScanned={handleBarcodeScanned}
        />
        {focusPoint && (
          <View
            style={[
              styles.focusRing,
              {
                left: focusPoint.x - 25,
                top: focusPoint.y - 25,
              },
            ]}
          />
        )}

      </Pressable>

        <Pressable
        style={styles.flashButton}
        onPress={() => setFlash((f) => (f === "off" ? "on" : "off"))}
      >
        <Text style={styles.flashText}>
          {flash === "on" ? "🔦 ON" : "🔦 OFF"}
        </Text>
      </Pressable>

      {/* Marco visual */}
      <View
        pointerEvents="none"
        style={[
          styles.scanFrame,
          scanStatus === "success" && styles.frameSuccess,
          scanStatus === "warning" && styles.frameWarning,
          scanStatus === "error" && styles.frameError,
        ]}
      />

      <View style={styles.overlay}>
        <Text style={styles.scanText}>Escaneando productos…</Text>
        {scanMessage !== "" && (
          <View
            style={[
              styles.scanBadge,
              scanStatus === "success" && styles.badgeSuccess,
              scanStatus === "warning" && styles.badgeWarning,
              scanStatus === "error" && styles.badgeError,
            ]}
          >
            <Text style={styles.badgeText}>{scanMessage}</Text>
          </View>
        )}

        <Pressable
          style={styles.button}
          onPress={() => {setFlash("off"); router.push("/(tabs)/venta")}}
        >
          <Text style={styles.buttonText}>Cerrar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  text: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: "center",
  },
  overlay: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    alignItems: "center",
  },
  scanText: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#3A8DFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  scanFrame: {
  position: "absolute",
  top: "20%",
  left: "8%",
  right: "8%",
  height: "40%",
  borderWidth: 3,
  borderRadius: 16,
  borderColor: "rgba(255,255,255,0.4)",
  },
  frameSuccess: {
    borderColor: "#2E7D32",
  },
  frameWarning: {
    borderColor: "#ED6C02",
  },
  frameError: {
    borderColor: "#C62828",
  },
  scanBadge: {
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "700",
  },
  badgeSuccess: {
    backgroundColor: "#2E7D32",
  },
  badgeWarning: {
    backgroundColor: "#ED6C02",
  },
  badgeError: {
    backgroundColor: "#C62828",
  },
  flashButton: {
  position: "absolute",
  top: 50,
  right: 20,
  backgroundColor: "rgba(0,0,0,0.6)",
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 20,
},
flashText: {
  color: "#fff",
  fontWeight: "700",
},
focusRing: {
  position: "absolute",
  width: 50,
  height: 50,
  borderWidth: 2,
  borderColor: "#FFD700",
  borderRadius: 25,
},

});
