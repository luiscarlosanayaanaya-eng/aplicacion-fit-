import { db, exercises } from "@forja/db";
import { eq, or, isNull, desc } from "drizzle-orm";
import type { Exercise } from "@forja/db";

export async function getMyExercises(coachId: string): Promise<Exercise[]> {
  try {
    return await db
      .select()
      .from(exercises)
      .where(eq(exercises.coachId, coachId))
      .orderBy(desc(exercises.createdAt));
  } catch {
    return [];
  }
}

export async function getGlobalExercises(): Promise<Exercise[]> {
  try {
    return await db
      .select()
      .from(exercises)
      .where(eq(exercises.isPublic, true))
      .orderBy(exercises.name);
  } catch {
    return [];
  }
}

export async function getExercise(id: string): Promise<Exercise | null> {
  try {
    const [ex] = await db.select().from(exercises).where(eq(exercises.id, id)).limit(1);
    return ex ?? null;
  } catch {
    return null;
  }
}

export async function getAllExercisesForCoach(coachId: string): Promise<Exercise[]> {
  try {
    return await db
      .select()
      .from(exercises)
      .where(or(eq(exercises.coachId, coachId), eq(exercises.isPublic, true)))
      .orderBy(exercises.name);
  } catch {
    return [];
  }
}
