"use server";

import { revalidatePath } from "next/cache";
import { db, coaches, exercises } from "@forja/db";
import { eq } from "drizzle-orm";
import { getUser } from "@forja/auth/server";
import { createExerciseSchema } from "@forja/validators";

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
    await db.insert(exercises).values({ ...parsed.data, coachId, isPublic: false });
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
    await db
      .update(exercises)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(exercises.id, id));
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
    await db.delete(exercises).where(eq(exercises.id, id));
    revalidatePath("/exercises");
    return { success: true };
  } catch {
    return { error: "Error al eliminar el ejercicio." };
  }
}
