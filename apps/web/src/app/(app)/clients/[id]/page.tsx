import React from "react";
import { getUser } from "@forja/auth/server";
import { redirect, notFound } from "next/navigation";
import { getCurrentCoach } from "@/lib/auth";
import { getClient } from "@/lib/queries/clients";
import { DashboardShell } from "@/components/coach/dashboard-shell";
import { Badge } from "@forja/ui";
import { ArrowLeft, Mail, Phone, Ruler, Weight, Calendar, Target } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ClientDetailPage({ params }: Props): Promise<React.JSX.Element> {
  const user = await getUser();
  if (!user) redirect("/login");

  const coach = await getCurrentCoach();
  if (!coach) redirect("/onboarding");

  const { id } = await params;
  const client = await getClient(id, coach.id);
  if (!client) notFound();

  const initials = client.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const STATUS_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
    active: { label: "Activo", variant: "default" },
    inactive: { label: "Inactivo", variant: "secondary" },
    invited: { label: "Invitado", variant: "outline" },
  };
  const statusInfo = STATUS_LABELS[client.status] ?? STATUS_LABELS["active"]!;

  return (
    <DashboardShell>
      <div className="mb-6">
        <Link
          href="/clients"
          className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a clientes
        </Link>

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 text-2xl font-bold text-brand">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{client.name}</h1>
              <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
            </div>
            <p className="text-muted-foreground">{client.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Info card */}
        <div className="lg:col-span-1 rounded-2xl border border-border bg-card p-6 space-y-4">
          <h2 className="font-semibold">Información</h2>

          <div className="space-y-3 text-sm">
            {client.email && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <span>{client.email}</span>
              </div>
            )}
            {client.phone && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" />
                <span>{client.phone}</span>
              </div>
            )}
            {client.height && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Ruler className="h-4 w-4 shrink-0" />
                <span>{client.height} cm</span>
              </div>
            )}
            {client.initialWeight && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Weight className="h-4 w-4 shrink-0" />
                <span>{(client.initialWeight / 1000).toFixed(1)} kg (inicio)</span>
              </div>
            )}
            {client.birthDate && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>{new Date(client.birthDate).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}</span>
              </div>
            )}
          </div>
        </div>

        {/* Goal + Notes */}
        <div className="lg:col-span-2 space-y-4">
          {client.goal && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-brand" />
                <h2 className="font-semibold">Objetivo</h2>
              </div>
              <p className="text-sm text-muted-foreground">{client.goal}</p>
            </div>
          )}

          {client.notes && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-semibold mb-2">Notas internas</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{client.notes}</p>
            </div>
          )}

          <div className="rounded-2xl border-2 border-dashed border-border p-6 text-center text-muted-foreground">
            <p className="text-sm">Las rutinas asignadas y el historial de entrenamientos aparecerán aquí.</p>
            <p className="text-xs mt-1">Fase 2 — App del cliente</p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
