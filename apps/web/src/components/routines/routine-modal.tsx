"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Routine } from "@forja/db";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
  Button, Input, Label, Textarea, Select,
} from "@forja/ui";
import { createRoutine, updateRoutine } from "@/lib/actions/routines";

interface RoutineModalProps {
  open: boolean;
  onClose: () => void;
  routine?: Routine;
}

export function RoutineModal({ open, onClose, routine }: RoutineModalProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = routine
        ? await updateRoutine(routine.id, formData)
        : await createRoutine(formData);

      if ("error" in result && result.error) {
        setError(typeof result.error === "string" ? result.error : "Revisa los campos.");
      } else {
        onClose();
        if (!routine && "id" in result && result.id) {
          router.push(`/routines/${result.id}`);
        }
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{routine ? "Editar rutina" : "Crear rutina"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nombre *</Label>
            <Input id="name" name="name" defaultValue={routine?.name} required placeholder="Push/Pull/Legs 6 días" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" name="description" defaultValue={routine?.description ?? ""} placeholder="Rutina de 6 días enfocada en hipertrofia..." rows={2} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="durationWeeks">Duración (semanas)</Label>
              <Input id="durationWeeks" name="durationWeeks" type="number" min={1} max={52} defaultValue={routine?.durationWeeks ?? ""} placeholder="12" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="difficulty">Dificultad</Label>
              <Select id="difficulty" name="difficulty" defaultValue={routine?.difficulty ?? "intermediate"}>
                <option value="beginner">Principiante</option>
                <option value="intermediate">Intermedio</option>
                <option value="advanced">Avanzado</option>
              </Select>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : routine ? "Actualizar" : "Crear rutina"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
