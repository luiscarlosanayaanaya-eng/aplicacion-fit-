"use client";

import React, { useState, useTransition } from "react";
import type { Exercise } from "@forja/db";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  Button, Input,
} from "@forja/ui";
import { Search } from "lucide-react";
import { addExerciseToDay } from "@/lib/actions/routines";

interface ExerciseSelectorProps {
  open: boolean;
  onClose: () => void;
  dayId: string;
  routineId: string;
  currentOrder: number;
  exercises: Exercise[];
}

export function ExerciseSelector({ open, onClose, dayId, routineId, currentOrder, exercises }: ExerciseSelectorProps) {
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = exercises.filter((ex) =>
    ex.name.toLowerCase().includes(search.toLowerCase()) ||
    ex.muscleGroups.some((m) => m.toLowerCase().includes(search.toLowerCase()))
  );

  function handleSelect(exercise: Exercise) {
    startTransition(async () => {
      await addExerciseToDay(dayId, routineId, {
        exerciseId: exercise.id,
        order: currentOrder,
        sets: 3,
        repsMin: 8,
        repsMax: 12,
        restSeconds: 90,
      });
      onClose();
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Agregar ejercicio</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar ejercicio o músculo..."
            className="pl-9"
          />
        </div>

        <div className="max-h-[60vh] overflow-y-auto space-y-1">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No se encontraron ejercicios.</p>
          ) : (
            filtered.map((ex) => (
              <button
                key={ex.id}
                onClick={() => handleSelect(ex)}
                disabled={isPending}
                className="w-full rounded-xl px-4 py-3 text-left transition-colors hover:bg-muted flex items-start gap-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <span className="text-xs font-bold">{ex.name.slice(0, 2).toUpperCase()}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-medium truncate">{ex.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {ex.muscleGroups.slice(0, 3).join(" · ")}
                    {ex.muscleGroups.length > 3 && ` +${ex.muscleGroups.length - 3}`}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
