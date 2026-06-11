"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, Label, Card, CardContent } from "@forja/ui";

interface OnboardingFormProps {
  userId: string;
  userEmail: string;
  userName: string;
}

const BRAND_COLORS = [
  { value: "#6366f1", label: "Índigo" },
  { value: "#8b5cf6", label: "Violeta" },
  { value: "#ec4899", label: "Rosa" },
  { value: "#f59e0b", label: "Ámbar" },
  { value: "#10b981", label: "Esmeralda" },
  { value: "#ef4444", label: "Rojo" },
  { value: "#0ea5e9", label: "Celeste" },
  { value: "#1e293b", label: "Oscuro" },
];

export function OnboardingForm({ userId, userEmail, userName }: OnboardingFormProps) {
  const router = useRouter();
  const [name, setName] = useState(userName);
  const [slug, setSlug] = useState("");
  const [brandColor, setBrandColor] = useState("#6366f1");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function autoSlug(val: string) {
    return val
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/coaches/onboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, email: userEmail, name, slug, brandColor }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Error al guardar. Intenta de nuevo.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de tu marca / tu nombre</Label>
            <Input
              id="name"
              placeholder="Carlos García Fitness"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slug) setSlug(autoSlug(e.target.value));
              }}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Tu subdominio</Label>
            <div className="flex items-center rounded-xl border border-border overflow-hidden focus-within:ring-2 focus-within:ring-ring">
              <Input
                id="slug"
                className="rounded-none border-0 focus-visible:ring-0"
                placeholder="carlosgarcia"
                value={slug}
                onChange={(e) => setSlug(autoSlug(e.target.value))}
                required
                minLength={3}
              />
              <span className="shrink-0 border-l border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
                .forja.app
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Tus clientes accederán en: <strong>{slug || "tu-nombre"}.forja.app</strong>
            </p>
          </div>

          <div className="space-y-2">
            <Label>Color de marca</Label>
            <div className="flex flex-wrap gap-2">
              {BRAND_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  title={color.label}
                  onClick={() => setBrandColor(color.value)}
                  className={`h-8 w-8 rounded-full transition-all ${
                    brandColor === color.value
                      ? "ring-2 ring-offset-2 ring-foreground scale-110"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: color.value }}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <div
        className="rounded-2xl p-6 text-white"
        style={{ background: `linear-gradient(135deg, ${brandColor}, ${brandColor}cc)` }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-2">Vista previa</p>
        <p className="text-xl font-bold">{name || "Tu Marca"}</p>
        <p className="text-sm opacity-70 mt-1">{slug || "tu-nombre"}.forja.app</p>
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? "Creando tu espacio..." : "Crear mi app →"}
      </Button>
    </form>
  );
}
