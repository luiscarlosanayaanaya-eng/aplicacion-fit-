import Link from "next/link";
import { LoginForm } from "@/components/coach/login-form";

export const metadata = { title: "Iniciar sesión" };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold text-brand">
            Forja
          </Link>
          <h1 className="mt-4 text-2xl font-bold">Bienvenido de vuelta</h1>
          <p className="mt-1 text-sm text-muted-foreground">Entra a tu dashboard de coach</p>
        </div>
        <LoginForm />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <Link href="/signup" className="font-medium text-brand hover:underline">
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  );
}
