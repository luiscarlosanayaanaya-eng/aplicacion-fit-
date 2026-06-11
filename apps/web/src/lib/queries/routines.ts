import { db, routines, routineDays, routineExercises, exercises } from "@forja/db";
import { eq, desc } from "drizzle-orm";
import type { Routine, RoutineDay, RoutineExercise, Exercise } from "@forja/db";

export async function getRoutines(coachId: string): Promise<Routine[]> {
  try {
    return await db
      .select()
      .from(routines)
      .where(eq(routines.coachId, coachId))
      .orderBy(desc(routines.createdAt));
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
    const [routine] = await db
      .select()
      .from(routines)
      .where(eq(routines.id, id))
      .limit(1);

    if (!routine || routine.coachId !== coachId) return null;

    const days = await db
      .select()
      .from(routineDays)
      .where(eq(routineDays.routineId, id))
      .orderBy(routineDays.dayNumber);

    const daysWithExercises: RoutineDayWithExercises[] = await Promise.all(
      days.map(async (day) => {
        const dayExercises = await db
          .select({
            routineExercise: routineExercises,
            exercise: exercises,
          })
          .from(routineExercises)
          .innerJoin(exercises, eq(routineExercises.exerciseId, exercises.id))
          .where(eq(routineExercises.routineDayId, day.id))
          .orderBy(routineExercises.order);

        return {
          ...day,
          exercises: dayExercises.map((row) => ({
            ...row.routineExercise,
            exercise: row.exercise,
          })),
        };
      })
    );

    return { ...routine, days: daysWithExercises };
  } catch {
    return null;
  }
}
