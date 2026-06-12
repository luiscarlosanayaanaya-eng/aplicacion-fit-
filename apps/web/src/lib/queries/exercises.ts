import { supabaseAdmin, mapRows, mapRow } from "@/lib/supabase-admin";
import type { Exercise } from "@forja/db";

export async function getMyExercises(coachId: string): Promise<Exercise[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("exercises")
      .select("*")
      .eq("coach_id", coachId)
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return mapRows<Exercise>(data as Record<string, unknown>[]);
  } catch {
    return [];
  }
}

export async function getGlobalExercises(): Promise<Exercise[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("exercises")
      .select("*")
      .eq("is_public", true)
      .order("name");
    if (error || !data) return [];
    return mapRows<Exercise>(data as Record<string, unknown>[]);
  } catch {
    return [];
  }
}

export async function getExercise(id: string): Promise<Exercise | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("exercises")
      .select("*")
      .eq("id", id)
      .limit(1)
      .maybeSingle();
    if (error || !data) return null;
    return mapRow<Exercise>(data as Record<string, unknown>);
  } catch {
    return null;
  }
}

export async function getAllExercisesForCoach(coachId: string): Promise<Exercise[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("exercises")
      .select("*")
      .or(`coach_id.eq.${coachId},is_public.eq.true`)
      .order("name");
    if (error || !data) return [];
    return mapRows<Exercise>(data as Record<string, unknown>[]);
  } catch {
    return [];
  }
}
