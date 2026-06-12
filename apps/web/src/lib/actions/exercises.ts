"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getUser } from "@forja/auth/server";
import { createExerciseSchema } from "@forja/validators";

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

export async function createExercise(formData: FormData) {
  const coachId = await getCoachId();
  if (!coachId) return { error: "No autorizado" };

  const muscleGroupsRaw = formData.get("muscleGroups") as string;
  const equipmentRaw = formData.get("equipment") as string;

  const raw = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || undefined,
    instructions: (formData.get("instructions") as string) || undefined,
    muscleGroups: muscleGroupsRaw ? muscleGroupsRaw.split(",").map((s) => s.trim()).filter(Boolean) : [],
    equipment: equipmentRaw ? equipmentRaw.split(",").map((s) => s.trim()).filter(Boolean) : [],
    difficulty: (formData.get("difficulty") as string) || "intermediate",
    videoUrl: (formData.get("videoUrl") as string) || undefined,
    thumbnailUrl: (formData.get("thumbnailUrl") as string) || undefined,
  };

  const parsed = createExerciseSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  try {
    const { error } = await supabaseAdmin.from("exercises").insert({
      coach_id: coachId,
      name: parsed.data.name,
      description: parsed.data.description,
      instructions: parsed.data.instructions,
      muscle_groups: parsed.data.muscleGroups,
      equipment: parsed.data.equipment,
      difficulty: parsed.data.difficulty,
      video_url: parsed.data.videoUrl,
      thumbnail_url: parsed.data.thumbnailUrl,
      is_public: false,
    });
    if (error) return { error: "Error al crear el ejercicio." };
    revalidatePath("/exercises");
    return { success: true };
  } catch {
    return { error: "Error al crear el ejercicio." };
  }
}

export async function updateExercise(id: string, formData: FormData) {
  const coachId = await getCoachId();
  if (!coachId) return { error: "No autorizado" };

  const muscleGroupsRaw = formData.get("muscleGroups") as string;
  const equipmentRaw = formData.get("equipment") as string;

  const raw = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || undefined,
    instructions: (formData.get("instructions") as string) || undefined,
    muscleGroups: muscleGroupsRaw ? muscleGroupsRaw.split(",").map((s) => s.trim()).filter(Boolean) : [],
    equipment: equipmentRaw ? equipmentRaw.split(",").map((s) => s.trim()).filter(Boolean) : [],
    difficulty: (formData.get("difficulty") as string) || "intermediate",
    videoUrl: (formData.get("videoUrl") as string) || undefined,
    thumbnailUrl: (formData.get("thumbnailUrl") as string) || undefined,
  };

  const parsed = createExerciseSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  try {
    const { error } = await supabaseAdmin
      .from("exercises")
      .update({
        name: parsed.data.name,
        description: parsed.data.description,
        instructions: parsed.data.instructions,
        muscle_groups: parsed.data.muscleGroups,
        equipment: parsed.data.equipment,
        difficulty: parsed.data.difficulty,
        video_url: parsed.data.videoUrl,
        thumbnail_url: parsed.data.thumbnailUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("coach_id", coachId);
    if (error) return { error: "Error al actualizar el ejercicio." };
    revalidatePath("/exercises");
    revalidatePath(`/exercises/${id}`);
    return { success: true };
  } catch {
    return { error: "Error al actualizar el ejercicio." };
  }
}

export async function deleteExercise(id: string) {
  const coachId = await getCoachId();
  if (!coachId) return { error: "No autorizado" };

  try {
    const { error } = await supabaseAdmin
      .from("exercises")
      .delete()
      .eq("id", id)
      .eq("coach_id", coachId);
    if (error) return { error: "Error al eliminar el ejercicio." };
    revalidatePath("/exercises");
    return { success: true };
  } catch {
    return { error: "Error al eliminar el ejercicio." };
  }
}
