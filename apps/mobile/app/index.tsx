import { Redirect } from "expo-router";

export default function Index() {
  // TODO: verificar sesión y redirigir
  return <Redirect href="/(auth)/login" />;
}
