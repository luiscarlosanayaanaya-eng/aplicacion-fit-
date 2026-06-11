"use client";

import React, { useState } from "react";
import type { Routine } from "@forja/db";
import {
  Badge, Button, Card, CardContent,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
} from "@forja/ui";
import { MoreHorizontal, Pencil, Trash2, ChevronRight, Clock, Dumbbell } from "lucide-react";
import Link from "next/link";
import { RoutineModal } from "./routine-modal";
import { deleteRoutine } from "@/lib/actions/routines";

interface RoutineCardProps {
  routine: Routine;
}

const DIFFICULTY_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  beginner: { label: "Principiante", variant: "secondary" },
  intermediate: { label: "Intermedio", variant: "default" },
  advanced: { label: "Avanzado", variant: "outline" },
};

export function RoutineCard({ routine }: RoutineCardProps) {
  const [editing, setEditing] = useState(false);
  const diffInfo = DIFFICULTY_LABELS[routine.difficulty ?? "intermediate"] ?? DIFFICULTY_LABELS["intermediate"]!;

  async function handleDelete() {
    if (!confirm("¿Eliminar esta rutina? Se perderán todos sus días y ejercicios.")) return;
    await deleteRoutine(routine.id);
  }

  return (
    <>
      <Card className="group hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold truncate">{routine.name}</h3>
                <Badge variant={diffInfo.variant} className="text-xs shrink-0">{diffInfo.label}</Badge>
              </div>
              {routine.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{routine.description}</p>
              )}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {routine.durationWeeks && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {routine.durationWeeks} semanas
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Dumbbell className="h-3 w-3" /> Plantilla
                </span>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditing(true)}>
                  <Pencil className="h-4 w-4" /> Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                  <Trash2 className="h-4 w-4" /> Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Link
            href={`/routines/${routine.id}`}
            className="mt-4 flex items-center justify-end gap-1 text-sm text-brand hover:underline"
          >
            Abrir constructor <ChevronRight className="h-4 w-4" />
          </Link>
        </CardContent>
      </Card>

      <RoutineModal open={editing} onClose={() => setEditing(false)} routine={routine} />
    </>
  );
}
