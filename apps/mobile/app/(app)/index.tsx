import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TodayScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.greeting}>Buenos días 👋</Text>
        <Text style={styles.subtitle}>Aquí está tu plan de hoy</Text>

        {/* Placeholder cards */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Rutina de hoy</Text>
          <Text style={styles.cardTitle}>Sin rutina asignada</Text>
          <Text style={styles.cardSub}>Tu coach aún no ha asignado una rutina para hoy.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Plan nutricional</Text>
          <Text style={styles.cardTitle}>Sin plan activo</Text>
          <Text style={styles.cardSub}>Pide a tu coach que te asigne un plan de alimentación.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8fafc" },
  container: { padding: 20, gap: 16 },
  greeting: { fontSize: 26, fontWeight: "800", color: "#0f172a", marginBottom: 2 },
  subtitle: { fontSize: 14, color: "#64748b", marginBottom: 8 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardLabel: { fontSize: 11, fontWeight: "700", color: "#6366f1", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
  cardTitle: { fontSize: 17, fontWeight: "700", color: "#0f172a", marginBottom: 4 },
  cardSub: { fontSize: 13, color: "#64748b" },
});
