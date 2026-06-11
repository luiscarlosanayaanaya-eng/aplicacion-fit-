import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WorkoutScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Entrenamiento</Text>
        <Text style={styles.sub}>Tu rutina del día aparecerá aquí.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8fafc" },
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  title: { fontSize: 22, fontWeight: "800", color: "#0f172a" },
  sub: { fontSize: 14, color: "#64748b", textAlign: "center", marginTop: 8 },
});
