"use client";

import React, { useState, useTransition } from "react";
import type { Exercise } from "@forja/db";
import type { RoutineWithDays } from "@/lib/queries/routines";
import { Button, Input, Badge } from "@forja/ui";
import { Plus, Trash2, GripVertical, Moon, Dumbbell, ChevronDown, ChevronRight } from "lucide-react";
import { addRoutineDay, deleteRoutineDay, removeExerciseFromDay } from "@/lib/actions/routines";
import { ExerciseSelector } from "./exercise-selector";

interface RoutineBuilderProps {
  routine: RoutineWithDays;
  availableExercises: Exercise[];
}

export function RoutineBuilder({ routine, availableExercises }: RoutineBuilderProps) {
  const [isPending, startTransition] = useTransition();
  const [expandedDays, setExpandedDays] = useState<Set<string>>(
    new Set(routine.days.map((d) => d.id))
  );
  const [selectorState, setSelectorState] = useState<{
    open: boolean;
    dayId: string;
    order: number;
  } | null>(null);

  function toggleDay(id: string) {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleAddDay() {
    const nextDayNumber = (routine.days.at(-1)?.dayNumber ?? 0) + 1;
    startTransition(async () => {
      await addRoutineDay(routine.id, { dayNumber: nextDayNumber, name: `Día ${nextDayNumber}` });
    });
  }

  function handleDeleteDay(dayId: string) {
    if (!confirm("¿Eliminar este día y todos sus ejercicios?")) return;
    startTransition(async () => {
      await deleteRoutineDay(dayId, routine.id);
    });
  }

  function handleRemoveExercise(routineExerciseId: string) {
    startTransition(async () => {
      await removeExerciseFromDay(routineExerciseId, routine.id);
    });
  }

  return (
    <div className="space-y-3">
      {routine.days.map((day) => {
        const expanded = expandedDays.has(day.id);

        return (
          <div key={day.id} className="rounded-2xl border border-border bg-card overflow-hidden">
            {/* Day header */}
            <div
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toggleDay(day.id)}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground/50 shrink-0" />

              <div className="flex-1 flex items-center gap-3">
                <span className="text-sm font-semibold">{day.name ?? `Día ${day.dayNumber}`}</span>
                {day.restDay && (
                  <Badge variant="secondary" className="text-xs gap-1">
                    <Moon className="h-3 w-3" /> Descanso
                  </Badge>
                )}
                {!day.restDay && (
                  <span className="text-xs text-muted-foreground">
                    {day.exercises.length} ejercicio{day.exercises.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                  onClick={(e) => { e.stopPropagation(); handleDeleteDay(day.id); }}
                  disabled={isPending}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
                {expanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>

            {/* Day exercises */}
            {expanded && !day.restDay && (
              <div className="border-t border-border">
                {day.exercises.length > 0 && (
                  <div className="divide-y divide-border">
                    {day.exercises.map((re, idx) => (
                      <div key={re.id} className="flex items-center gap-3 px-4 py-3">
                        <span className="text-xs font-mono text-muted-foreground w-5 shrink-0">{idx + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{re.exercise.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {re.sets} series · {re.repsMin}–{re.repsMax} reps · {re.restSeconds}s descanso
                            {re.rpe && ` · RPE ${re.rpe}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {re.exercise.muscleGroups.slice(0, 2).map((m) => (
                            <span key={m} className="rounded-full bg-brand/10 px-2 py-0.5 text-xs text-brand">
                              {m}
                            </span>
                          ))}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveExercise(re.id)}
                            disabled={isPending}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="px-4 py-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => setSelectorState({ open: true, dayId: day.id, order: day.exercises.length })}
                    disabled={isPending}
                  >
                    <Plus className="h-4 w-4" /> Agregar ejercicio
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Add day button */}
      <button
        onClick={handleAddDay}
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border py-4 text-sm text-muted-foreground hover:border-brand/50 hover:text-brand transition-colors disabled:opacity-50"
      >
        <Plus className="h-4 w-4" />
        Agregar día de entrenamiento
      </button>

      {selectorState && (
        <ExerciseSelector
          open={selectorState.open}
          onClose={() => setSelectorState(null)}
          dayId={selectorState.dayId}
          routineId={routine.id}
          currentOrder={selectorState.order}
          exercises={availableExercises}
        />
      )}
    </div>
  );
}
