import React from "react";
import { getUser } from "@forja/auth/server";
import { redirect } from "next/navigation";
import { getCurrentCoach } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { DashboardShell } from "@/components/coach/dashboard-shell";
import { Card, CardContent } from "@forja/ui";
import { Users, ClipboardList, Dumbbell, TrendingUp } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Dashboard — Forja" };

async function getStats(coachId: string) {
  try {
    const [{ count: clientCount }, { count: routineCount }, { count: exerciseCount }] =
      await Promise.all([
        supabaseAdmin.from("clients").select("*", { count: "exact", head: true }).eq("coach_id", coachId),
        supabaseAdmin.from("routines").select("*", { count: "exact", head: true }).eq("coach_id", coachId),
        supabaseAdmin.from("exercises").select("*", { count: "exact", head: true }).eq("coach_id", coachId),
      ]);
    return {
      clients: clientCount ?? 0,
      routines: routineCount ?? 0,
      exercises: exerciseCount ?? 0,
    };
  } catch {
    return { clients: 0, routines: 0, exercises: 0 };
  }
}

export default async function DashboardPage(): Promise<React.JSX.Element> {
  const user = await getUser();
  if (!user) redirect("/login");

  const coach = await getCurrentCoach();
  if (!coach) redirect("/onboarding");

  const stats = await getStats(coach.id);

  const statCards = [
    {
      label: "Clientes activos",
      value: stats.clients,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/30",
      href: "/clients",
    },
    {
      label: "Rutinas creadas",
      value: stats.routines,
      icon: ClipboardList,
      color: "text-violet-500",
      bg: "bg-violet-50 dark:bg-violet-950/30",
      href: "/routines",
    },
    {
      label: "Ejercicios en librería",
      value: stats.exercises,
      icon: Dumbbell,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      href: "/exercises",
    },
    {
      label: "Adherencia promedio",
      value: "—",
      icon: TrendingUp,
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-950/30",
      href: "#",
    },
  ];

  return (
    <DashboardShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Bienvenido, {coach.name.split(" ")[0]}</h1>
        <p className="text-muted-foreground">Aquí está el resumen de tu academia.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`rounded-xl ${stat.bg} p-3 shrink-0`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick start */}
      {stats.clients === 0 && stats.routines === 0 && (
        <div className="rounded-2xl border border-border bg-gradient-to-br from-brand/5 to-transparent p-6">
          <h2 className="font-semibold mb-1">Primeros pasos</h2>
          <p className="text-sm text-muted-foreground mb-4">Configura tu academia en 3 pasos rápidos.</p>
          <div className="space-y-3">
            {[
              { step: 1, text: "Crea tu librería de ejercicios", href: "/exercises" },
              { step: 2, text: "Diseña tu primera rutina", href: "/routines" },
              { step: 3, text: "Agrega tu primer cliente", href: "/clients" },
            ].map(({ step, text, href }) => (
              <Link
                key={step}
                href={href}
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm hover:bg-muted transition-colors"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">
                  {step}
                </span>
                {text}
              </Link>
            ))}
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
