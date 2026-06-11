"use client";

import React, { useState, useTransition } from "react";
import type { Exercise } from "@forja/db";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
  Button, Input, Label, Textarea, Select,
} from "@forja/ui";
import { createExercise, updateExercise } from "@/lib/actions/exercises";

const MUSCLE_GROUPS = [
  "Pecho", "Espalda", "Hombros", "Bíceps", "Tríceps", "Antebrazos",
  "Cuádriceps", "Isquiotibiales", "Glúteos", "Pantorrillas", "Core", "Cardio",
];

const EQUIPMENT = [
  "Barra", "Mancuernas", "Máquina", "Cable", "Polea", "Kettlebell",
  "TRX", "Bandas", "Peso corporal", "Banco", "Paralelas",
];

interface ExerciseModalProps {
  open: boolean;
  onClose: () => void;
  exercise?: Exercise;
}

export function ExerciseModal({ open, onClose, exercise }: ExerciseModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>(exercise?.muscleGroups ?? []);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(exercise?.equipment ?? []);

  function toggleChip(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("muscleGroups", selectedMuscles.join(","));
    formData.set("equipment", selectedEquipment.join(","));

    startTransition(async () => {
      const result = exercise
        ? await updateExercise(exercise.id, formData)
        : await createExercise(formData);

      if ("error" in result && result.error) {
        setError(typeof result.error === "string" ? result.error : "Revisa los campos.");
      } else {
        onClose();
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{exercise ? "Editar ejercicio" : "Crear ejercicio"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="name">Nombre *</Label>
              <Input id="name" name="name" defaultValue={exercise?.name} required placeholder="Press banca plano" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" name="description" defaultValue={exercise?.description ?? ""} placeholder="Ejercicio compuesto para el desarrollo del pecho..." rows={2} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="instructions">Instrucciones de ejecución</Label>
            <Textarea id="instructions" name="instructions" defaultValue={exercise?.instructions ?? ""} placeholder="1. Acuéstate en el banco... 2. Agarra la barra..." rows={3} />
          </div>

          <div className="space-y-2">
            <Label>Grupos musculares</Label>
            <div className="flex flex-wrap gap-2">
              {MUSCLE_GROUPS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => toggleChip(selectedMuscles, setSelectedMuscles, m)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    selectedMuscles.includes(m)
                      ? "bg-brand text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Equipamiento</Label>
            <div className="flex flex-wrap gap-2">
              {EQUIPMENT.map((eq) => (
                <button
                  key={eq}
                  type="button"
                  onClick={() => toggleChip(selectedEquipment, setSelectedEquipment, eq)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    selectedEquipment.includes(eq)
                      ? "bg-brand text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {eq}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="difficulty">Dificultad</Label>
              <Select id="difficulty" name="difficulty" defaultValue={exercise?.difficulty ?? "intermediate"}>
                <option value="beginner">Principiante</option>
                <option value="intermediate">Intermedio</option>
                <option value="advanced">Avanzado</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="videoUrl">URL de video (opcional)</Label>
              <Input id="videoUrl" name="videoUrl" type="url" defaultValue={exercise?.videoUrl ?? ""} placeholder="https://youtube.com/..." />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : exercise ? "Actualizar" : "Crear ejercicio"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
