import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { router } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>Forja</Text>
      <Text style={styles.title}>Bienvenido</Text>
      <Text style={styles.subtitle}>Entra con tu cuenta de cliente</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#94a3b8"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#94a3b8"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/(app)")}
        >
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", justifyContent: "center", padding: 24 },
  brand: { fontSize: 28, fontWeight: "800", color: "#6366f1", textAlign: "center", marginBottom: 8 },
  title: { fontSize: 24, fontWeight: "700", textAlign: "center", color: "#0f172a" },
  subtitle: { fontSize: 14, color: "#64748b", textAlign: "center", marginBottom: 32 },
  form: { gap: 12 },
  input: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#0f172a",
  },
  button: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#6366f1",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
