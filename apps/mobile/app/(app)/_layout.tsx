import { Tabs } from "expo-router";
import { Dumbbell, Home, Salad, MessageCircle, User } from "lucide-react-native";

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#6366f1",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          borderTopColor: "#e2e8f0",
          backgroundColor: "#fff",
          paddingBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Hoy", tabBarIcon: ({ color, size }) => <Home size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="workout"
        options={{ title: "Entrenar", tabBarIcon: ({ color, size }) => <Dumbbell size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{ title: "Nutrición", tabBarIcon: ({ color, size }) => <Salad size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="chat"
        options={{ title: "Chat", tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Perfil", tabBarIcon: ({ color, size }) => <User size={size} color={color} /> }}
      />
    </Tabs>
  );
}
