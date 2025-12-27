import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginUsuario } from "../../src/services/usuario.service";
import { saveSession } from "../../src/utils/auth";
import { useRouter } from "expo-router";

const schema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(4, "Mínimo 4 caracteres"),
});

type LoginForm = z.infer<typeof schema>;

export default function LoginScreen() {
  const router = useRouter();
  const {
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await loginUsuario(data.email, data.password);
      await saveSession(res.token, res.user);
      router.replace("/(tabs)/venta");
    } catch (err: any) {
      alert(err.message || "Error al iniciar sesión");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* HEADER GRADIENTE */}
      <LinearGradient
        colors={["#5F2EEA", "#3A8DFF"]}
        style={styles.header}
      >
        <Text style={styles.logo}>CONTROL</Text>
        <Text style={styles.logoBold}>VENTAS</Text>
      </LinearGradient>

      {/* CARD */}
      <View style={styles.card}>
        <Text style={styles.welcome}>Bienvenid@</Text>

        <View style={styles.field}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={(v) => setValue("email", v)}
          />
          {errors.email && (
            <Text style={styles.error}>{errors.email.message}</Text>
          )}
        </View>

        <View style={styles.field}>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry
            onChangeText={(v) => setValue("password", v)}
          />
          {errors.password && (
            <Text style={styles.error}>{errors.password.message}</Text>
          )}
        </View>

        <Pressable
          style={[
            styles.button,
            isSubmitting && styles.buttonDisabled,
          ]}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Ingresar</Text>
          )}
        </Pressable>

        <Text style={styles.footer}>
          © {new Date().getFullYear()} Control Ventas
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 260,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    color: "#fff",
    fontSize: 22,
    letterSpacing: 2,
  },
  logoBold: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#fff",
    marginTop: -60,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  welcome: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 24,
    color: "#333",
  },
  field: {
    marginBottom: 14,
  },
  input: {
    backgroundColor: "#F4F4F4",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#3A8DFF",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  error: {
    color: "#E53935",
    fontSize: 12,
    marginTop: 4,
  },
  footer: {
    marginTop: 18,
    textAlign: "center",
    fontSize: 12,
    color: "#999",
  },
});
