"use server";

import { revalidatePath } from "next/cache";
import { db, coaches, routines, routineDays, routineExercises } from "@forja/db";
import { eq } from "drizzle-orm";
import { getUser } from "@forja/auth/server";
import { createRoutineSchema } from "@forja/validators";

async function getCoachId(): Promise<string | null> {
  try {
    const user = await getUser();
    if (!user) return null;
    const [coach] = await db.select({ id: coaches.id }).from(coaches).where(eq(coaches.userId, user.id)).limit(1);
    return coach?.id ?? null;
  } catch {
    return null;
  }
}

export async function createRoutine(formData: FormData) {
  const coachId = await getCoachId();
  if (!coachId) return { error: "No autorizado" };

  const raw = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || undefined,
    durationWeeks: formData.get("durationWeeks") ? Number(formData.get("durationWeeks")) : undefined,
    difficulty: (formData.get("difficulty") as string) || "intermediate",
  };

  const parsed = createRoutineSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  try {
    const [routine] = await db
      .insert(routines)
      .values({ ...parsed.data, coachId, isTemplate: true })
      .returning({ id: routines.id });
    revalidatePath("/routines");
    return { success: true, id: routine?.id };
  } catch {
    return { error: "Error al crear la rutina." };
  }
}

export async function updateRoutine(id: string, formData: FormData) {
  const coachId = await getCoachId();
  if (!coachId) return { error: "No autorizado" };

  const raw = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || undefined,
    durationWeeks: formData.get("durationWeeks") ? Number(formData.get("durationWeeks")) : undefined,
    difficulty: (formData.get("difficulty") as string) || "intermediate",
  };

  const parsed = createRoutineSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  try {
    await db.update(routines).set({ ...parsed.data, updatedAt: new Date() }).where(eq(routines.id, id));
    revalidatePath("/routines");
    revalidatePath(`/routines/${id}`);
    return { success: true };
  } catch {
    return { error: "Error al actualizar la rutina." };
  }
}

export async function deleteRoutine(id: string) {
  const coachId = await getCoachId();
  if (!coachId) return { error: "No autorizado" };

  try {
    await db.delete(routines).where(eq(routines.id, id));
    revalidatePath("/routines");
    return { success: true };
  } catch {
    return { error: "Error al eliminar la rutina." };
  }
}

export async function addRoutineDay(routineId: string, data: { dayNumber: number; name?: string; restDay?: boolean }) {
  const coachId = await getCoachId();
  if (!coachId) return { error: "No autorizado" };

  try {
    const [day] = await db
      .insert(routineDays)
      .values({ routineId, ...data })
      .returning({ id: routineDays.id });
    revalidatePath(`/routines/${routineId}`);
    return { success: true, id: day?.id };
  } catch {
    return { error: "Error al agregar el día." };
  }
}

export async function deleteRoutineDay(dayId: string, routineId: string) {
  const coachId = await getCoachId();
  if (!coachId) return { error: "No autorizado" };

  try {
    await db.delete(routineDays).where(eq(routineDays.id, dayId));
    revalidatePath(`/routines/${routineId}`);
    return { success: true };
  } catch {
    return { error: "Error al eliminar el día." };
  }
}

export async function addExerciseToDay(
  dayId: string,
  routineId: string,
  data: {
    exerciseId: string;
    order: number;
    sets?: number;
    repsMin?: number;
    repsMax?: number;
    restSeconds?: number;
    rpe?: number;
    notes?: string;
  }
) {
  const coachId = await getCoachId();
  if (!coachId) return { error: "No autorizado" };

  try {
    await db.insert(routineExercises).values({
      routineDayId: dayId,
      exerciseId: data.exerciseId,
      order: data.order,
      sets: data.sets ?? 3,
      repsMin: data.repsMin ?? 8,
      repsMax: data.repsMax ?? 12,
      restSeconds: data.restSeconds ?? 90,
      rpe: data.rpe,
      notes: data.notes,
    });
    revalidatePath(`/routines/${routineId}`);
    return { success: true };
  } catch {
    return { error: "Error al agregar el ejercicio." };
  }
}

export async function removeExerciseFromDay(routineExerciseId: string, routineId: string) {
  const coachId = await getCoachId();
  if (!coachId) return { error: "No autorizado" };

  try {
    await db.delete(routineExercises).where(eq(routineExercises.id, routineExerciseId));
    revalidatePath(`/routines/${routineId}`);
    return { success: true };
  } catch {
    return { error: "Error al eliminar el ejercicio." };
  }
}
