import React from "react";
import { getUser } from "@forja/auth/server";
import { redirect, notFound } from "next/navigation";
import { getCurrentCoach } from "@/lib/auth";
import { getRoutineWithDays } from "@/lib/queries/routines";
import { getAllExercisesForCoach } from "@/lib/queries/exercises";
import { DashboardShell } from "@/components/coach/dashboard-shell";
import { RoutineBuilder } from "@/components/routines/routine-builder";
import { Badge } from "@forja/ui";
import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
};

export default async function RoutineBuilderPage({ params }: Props): Promise<React.JSX.Element> {
  const user = await getUser();
  if (!user) redirect("/login");

  const coach = await getCurrentCoach();
  if (!coach) redirect("/onboarding");

  const { id } = await params;
  const [routine, exercises] = await Promise.all([
    getRoutineWithDays(id, coach.id),
    getAllExercisesForCoach(coach.id),
  ]);

  if (!routine) notFound();

  return (
    <DashboardShell>
      <div className="mb-6">
        <Link
          href="/routines"
          className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a rutinas
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold">{routine.name}</h1>
              <Badge variant="secondary">
                {DIFFICULTY_LABELS[routine.difficulty ?? "intermediate"] ?? "Intermedio"}
              </Badge>
            </div>
            {routine.description && (
              <p className="text-muted-foreground text-sm">{routine.description}</p>
            )}
            {routine.durationWeeks && (
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" /> {routine.durationWeeks} semanas
              </p>
            )}
          </div>

          <div className="text-right text-sm text-muted-foreground">
            <p>{routine.days.length} día{routine.days.length !== 1 ? "s" : ""}</p>
            <p>
              {routine.days.reduce((acc, d) => acc + d.exercises.length, 0)} ejercicio
              {routine.days.reduce((acc, d) => acc + d.exercises.length, 0) !== 1 ? "s" : ""} totales
            </p>
          </div>
        </div>
      </div>

      <RoutineBuilder routine={routine} availableExercises={exercises} />
    </DashboardShell>
  );
}
