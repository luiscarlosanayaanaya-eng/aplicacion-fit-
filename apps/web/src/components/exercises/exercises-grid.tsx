"use client";

import React, { useState } from "react";
import type { Exercise } from "@forja/db";
import {
  Badge, Button, Card, CardContent,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
} from "@forja/ui";
import { MoreHorizontal, Pencil, Trash2, Dumbbell, Play } from "lucide-react";
import { ExerciseModal } from "./exercise-modal";
import { deleteExercise } from "@/lib/actions/exercises";

interface ExercisesGridProps {
  exercises: Exercise[];
  editable?: boolean;
}

const DIFFICULTY_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  beginner: { label: "Principiante", variant: "secondary" },
  intermediate: { label: "Intermedio", variant: "default" },
  advanced: { label: "Avanzado", variant: "outline" },
};

export function ExercisesGrid({ exercises, editable = true }: ExercisesGridProps) {
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este ejercicio? Esta acción no se puede deshacer.")) return;
    await deleteExercise(id);
  }

  if (exercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-20 text-center">
        <Dumbbell className="mb-4 h-12 w-12 text-muted-foreground/40" />
        <p className="text-muted-foreground">No hay ejercicios en esta sección todavía.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {exercises.map((exercise) => {
          const diffInfo = DIFFICULTY_LABELS[exercise.difficulty ?? "intermediate"] ?? DIFFICULTY_LABELS["intermediate"]!;

          return (
            <Card key={exercise.id} className="relative group hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <h3 className="font-semibold leading-snug">{exercise.name}</h3>
                  {editable && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingExercise(exercise)}>
                          <Pencil className="h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(exercise.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                {exercise.description && (
                  <p className="mb-3 text-xs text-muted-foreground line-clamp-2">{exercise.description}</p>
                )}

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {exercise.muscleGroups.slice(0, 3).map((m) => (
                    <span key={m} className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
                      {m}
                    </span>
                  ))}
                  {exercise.muscleGroups.length > 3 && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      +{exercise.muscleGroups.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant={diffInfo.variant} className="text-xs">
                    {diffInfo.label}
                  </Badge>
                  {exercise.videoUrl && (
                    <a
                      href={exercise.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-brand hover:underline"
                    >
                      <Play className="h-3 w-3" /> Video
                    </a>
                  )}
                </div>

                {exercise.equipment.length > 0 && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {exercise.equipment.join(" · ")}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {editingExercise && (
        <ExerciseModal
          open={!!editingExercise}
          onClose={() => setEditingExercise(null)}
          exercise={editingExercise}
        />
      )}
    </>
  );
}
