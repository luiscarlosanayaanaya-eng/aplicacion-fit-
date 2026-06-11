import Link from "next/link";
import { SignupForm } from "@/components/coach/signup-form";

export const metadata = { title: "Crear cuenta" };

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold text-brand">
            Forja
          </Link>
          <h1 className="mt-4 text-2xl font-bold">Crea tu cuenta de coach</h1>
          <p className="mt-1 text-sm text-muted-foreground">14 días gratis. Sin tarjeta de crédito.</p>
        </div>
        <SignupForm />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-medium text-brand hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
