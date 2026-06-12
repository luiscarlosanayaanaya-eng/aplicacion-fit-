import { supabaseAdmin, mapRows, mapRow } from "@/lib/supabase-admin";
import type { Routine, RoutineDay, RoutineExercise, Exercise } from "@forja/db";

export async function getRoutines(coachId: string): Promise<Routine[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("routines")
      .select("*")
      .eq("coach_id", coachId)
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return mapRows<Routine>(data as Record<string, unknown>[]);
  } catch {
    return [];
  }
}

export type RoutineDayWithExercises = RoutineDay & {
  exercises: (RoutineExercise & { exercise: Exercise })[];
};

export type RoutineWithDays = Routine & { days: RoutineDayWithExercises[] };

export async function getRoutineWithDays(
  id: string,
  coachId: string
): Promise<RoutineWithDays | null> {
  try {
    const { data: routine, error: routineError } = await supabaseAdmin
      .from("routines")
      .select("*")
      .eq("id", id)
      .eq("coach_id", coachId)
      .limit(1)
      .maybeSingle();

    if (routineError || !routine) return null;

    const { data: days, error: daysError } = await supabaseAdmin
      .from("routine_days")
      .select("*")
      .eq("routine_id", id)
      .order("day_number");

    if (daysError || !days) return { ...mapRow<Routine>(routine as Record<string, unknown>), days: [] };

    const daysWithExercises: RoutineDayWithExercises[] = await Promise.all(
      days.map(async (day: Record<string, unknown>) => {
        const { data: rExercises } = await supabaseAdmin
          .from("routine_exercises")
          .select("*, exercises(*)")
          .eq("routine_day_id", day.id as string)
          .order("order");

        const exercises = (rExercises ?? []).map((re: Record<string, unknown>) => {
          const { exercises: ex, ...rest } = re;
          return {
            ...mapRow<RoutineExercise>(rest as Record<string, unknown>),
            exercise: mapRow<Exercise>(ex as Record<string, unknown>),
          };
        });

        return { ...mapRow<RoutineDay>(day), exercises };
      })
    );

    return { ...mapRow<Routine>(routine as Record<string, unknown>), days: daysWithExercises };
  } catch {
    return null;
  }
}
