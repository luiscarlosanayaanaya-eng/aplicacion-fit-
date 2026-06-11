import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NutritionScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Nutrición</Text>
        <Text style={styles.sub}>Tu plan alimenticio aparecerá aquí.</Text>
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
