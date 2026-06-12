"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getUser } from "@forja/auth/server";
import { createRoutineSchema } from "@forja/validators";

async function getCoachId(): Promise<string | null> {
  try {
    const user = await getUser();
    if (!user) return null;
    const { data } = await supabaseAdmin
      .from("coaches")
      .select("id")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();
    return data?.id ?? null;
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
    const { data, error } = await supabaseAdmin
      .from("routines")
      .insert({
        coach_id: coachId,
        name: parsed.data.name,
        description: parsed.data.description,
        duration_weeks: parsed.data.durationWeeks,
        difficulty: parsed.data.difficulty,
        is_template: true,
      })
      .select("id")
      .single();
    if (error) return { error: "Error al crear la rutina." };
    revalidatePath("/routines");
    return { success: true, id: data?.id };
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
    const { error } = await supabaseAdmin
      .from("routines")
      .update({
        name: parsed.data.name,
        description: parsed.data.description,
        duration_weeks: parsed.data.durationWeeks,
        difficulty: parsed.data.difficulty,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("coach_id", coachId);
    if (error) return { error: "Error al actualizar la rutina." };
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
    const { error } = await supabaseAdmin
      .from("routines")
      .delete()
      .eq("id", id)
      .eq("coach_id", coachId);
    if (error) return { error: "Error al eliminar la rutina." };
    revalidatePath("/routines");
    return { success: true };
  } catch {
    return { error: "Error al eliminar la rutina." };
  }
}

export async function addRoutineDay(
  routineId: string,
  data: { dayNumber: number; name?: string; restDay?: boolean }
) {
  const coachId = await getCoachId();
  if (!coachId) return { error: "No autorizado" };

  try {
    const { data: day, error } = await supabaseAdmin
      .from("routine_days")
      .insert({ routine_id: routineId, day_number: data.dayNumber, name: data.name, rest_day: data.restDay })
      .select("id")
      .single();
    if (error) return { error: "Error al agregar el día." };
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
    const { error } = await supabaseAdmin.from("routine_days").delete().eq("id", dayId);
    if (error) return { error: "Error al eliminar el día." };
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
    const { error } = await supabaseAdmin.from("routine_exercises").insert({
      routine_day_id: dayId,
      exercise_id: data.exerciseId,
      order: data.order,
      sets: data.sets ?? 3,
      reps_min: data.repsMin ?? 8,
      reps_max: data.repsMax ?? 12,
      rest_seconds: data.restSeconds ?? 90,
      rpe: data.rpe,
      notes: data.notes,
    });
    if (error) return { error: "Error al agregar el ejercicio." };
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
    const { error } = await supabaseAdmin
      .from("routine_exercises")
      .delete()
      .eq("id", routineExerciseId);
    if (error) return { error: "Error al eliminar el ejercicio." };
    revalidatePath(`/routines/${routineId}`);
    return { success: true };
  } catch {
    return { error: "Error al eliminar el ejercicio." };
  }
}
