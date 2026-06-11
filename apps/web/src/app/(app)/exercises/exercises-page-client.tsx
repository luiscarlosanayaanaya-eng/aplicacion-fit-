"use client";

import React, { useState } from "react";
import type { Exercise } from "@forja/db";
import { Button, Tabs, TabsList, TabsTrigger, TabsContent } from "@forja/ui";
import { Plus } from "lucide-react";
import { ExercisesGrid } from "@/components/exercises/exercises-grid";
import { ExerciseModal } from "@/components/exercises/exercise-modal";
import { DashboardShell } from "@/components/coach/dashboard-shell";

interface ExercisesPageClientProps {
  myExercises: Exercise[];
  globalExercises: Exercise[];
}

export function ExercisesPageClient({ myExercises, globalExercises }: ExercisesPageClientProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <DashboardShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ejercicios</h1>
          <p className="text-muted-foreground">
            {myExercises.length} ejercicio{myExercises.length !== 1 ? "s" : ""} en tu librería
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Crear ejercicio
        </Button>
      </div>

      <Tabs defaultValue="mine">
        <TabsList className="mb-6">
          <TabsTrigger value="mine">Mi librería ({myExercises.length})</TabsTrigger>
          <TabsTrigger value="global">Global ({globalExercises.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="mine">
          <ExercisesGrid exercises={myExercises} editable />
        </TabsContent>

        <TabsContent value="global">
          <ExercisesGrid exercises={globalExercises} editable={false} />
        </TabsContent>
      </Tabs>

      <ExerciseModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </DashboardShell>
  );
}
