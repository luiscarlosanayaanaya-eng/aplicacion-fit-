import { pgTable, text, timestamp, uuid, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { coaches } from "./coaches";
import { clients } from "./clients";
import { exercises } from "./exercises";

export const routines = pgTable("routines", {
  id: uuid("id").primaryKey().defaultRandom(),
  coachId: uuid("coach_id").notNull().references(() => coaches.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  durationWeeks: integer("duration_weeks"),
  difficulty: varchar("difficulty", { length: 20 }).default("intermediate"),
  isTemplate: boolean("is_template").default(true).notNull(), // true = plantilla; false = copia asignada
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const routineDays = pgTable("routine_days", {
  id: uuid("id").primaryKey().defaultRandom(),
  routineId: uuid("routine_id").notNull().references(() => routines.id, { onDelete: "cascade" }),
  dayNumber: integer("day_number").notNull(), // 1-7
  name: text("name"), // ej: "Pierna A", "Push"
  notes: text("notes"),
  restDay: boolean("rest_day").default(false).notNull(),
});

export const routineExercises = pgTable("routine_exercises", {
  id: uuid("id").primaryKey().defaultRandom(),
  routineDayId: uuid("routine_day_id").notNull().references(() => routineDays.id, { onDelete: "cascade" }),
  exerciseId: uuid("exercise_id").notNull().references(() => exercises.id),
  order: integer("order").notNull().default(0),
  sets: integer("sets").notNull().default(3),
  repsMin: integer("reps_min").default(8),
  repsMax: integer("reps_max").default(12),
  rpe: integer("rpe"), // RPE objetivo 1-10
  restSeconds: integer("rest_seconds").default(90),
  notes: text("notes"),
  weightKg: integer("weight_kg"), // gramos para evitar float
  tempo: varchar("tempo", { length: 10 }), // ej: "3-1-2-0"
});

export const assignments = pgTable("assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  coachId: uuid("coach_id").notNull().references(() => coaches.id, { onDelete: "cascade" }),
  clientId: uuid("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  routineId: uuid("routine_id").notNull().references(() => routines.id),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }),
  status: varchar("status", { length: 20 }).notNull().default("active"), // active|completed|paused
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Routine = typeof routines.$inferSelect;
export type NewRoutine = typeof routines.$inferInsert;
export type RoutineDay = typeof routineDays.$inferSelect;
export type RoutineExercise = typeof routineExercises.$inferSelect;
export type Assignment = typeof assignments.$inferSelect;
