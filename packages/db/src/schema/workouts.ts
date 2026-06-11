import { pgTable, text, timestamp, uuid, integer, boolean, varchar } from "drizzle-orm/pg-core";
import { clients } from "./clients";
import { assignments } from "./routines";
import { coaches } from "./coaches";
import { routineExercises } from "./routines";

export const workoutLogs = pgTable("workout_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  coachId: uuid("coach_id").notNull().references(() => coaches.id, { onDelete: "cascade" }),
  clientId: uuid("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  assignmentId: uuid("assignment_id").references(() => assignments.id),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  durationSeconds: integer("duration_seconds"),
  notes: text("notes"),
  mood: integer("mood"), // 1-5 (cómo se sintió el cliente)
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const setLogs = pgTable("set_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  workoutLogId: uuid("workout_log_id").notNull().references(() => workoutLogs.id, { onDelete: "cascade" }),
  routineExerciseId: uuid("routine_exercise_id").references(() => routineExercises.id),
  setNumber: integer("set_number").notNull(),
  weightGrams: integer("weight_grams"), // gramos para precisión sin floats
  reps: integer("reps"),
  rpe: integer("rpe"), // RPE percibido 1-10 (vs RPE objetivo → progressive overload)
  durationSeconds: integer("duration_seconds"), // para isométricos/cardio
  completed: boolean("completed").default(true).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type WorkoutLog = typeof workoutLogs.$inferSelect;
export type NewWorkoutLog = typeof workoutLogs.$inferInsert;
export type SetLog = typeof setLogs.$inferSelect;
export type NewSetLog = typeof setLogs.$inferInsert;
