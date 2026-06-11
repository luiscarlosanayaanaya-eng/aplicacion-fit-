"use client";

import React, { useState } from "react";
import type { Routine } from "@forja/db";
import { Button } from "@forja/ui";
import { Plus, ClipboardList } from "lucide-react";
import { RoutineCard } from "@/components/routines/routine-card";
import { RoutineModal } from "@/components/routines/routine-modal";
import { DashboardShell } from "@/components/coach/dashboard-shell";

interface RoutinesPageClientProps {
  routines: Routine[];
}

export function RoutinesPageClient({ routines }: RoutinesPageClientProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <DashboardShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Rutinas</h1>
          <p className="text-muted-foreground">
            {routines.length} rutina{routines.length !== 1 ? "s" : ""} creada{routines.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva rutina
        </Button>
      </div>

      {routines.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-20 text-center">
          <ClipboardList className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <h3 className="text-lg font-semibold">Sin rutinas todavía</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">
            Diseña tu primera rutina con días, ejercicios, series y tiempos de descanso.
          </p>
          <Button onClick={() => setModalOpen(true)} className="mt-6 gap-2">
            <Plus className="h-4 w-4" />
            Crear rutina
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {routines.map((routine) => (
            <RoutineCard key={routine.id} routine={routine} />
          ))}
        </div>
      )}

      <RoutineModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </DashboardShell>
  );
}
