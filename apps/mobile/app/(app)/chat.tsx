import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Chat con tu coach</Text>
        <Text style={styles.sub}>Los mensajes con tu coach aparecerán aquí.</Text>
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
