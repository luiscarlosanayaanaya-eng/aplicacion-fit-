import { z } from "zod";

// ─── Coach ────────────────────────────────────────────────────────────────────

export const coachOnboardingSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  slug: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Solo letras minúsculas, números y guiones"),
  brandColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  bio: z.string().max(500).optional(),
});

export const coachBrandSchema = z.object({
  name: z.string().min(2),
  bio: z.string().max(500).optional(),
  brandColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

// ─── Client ───────────────────────────────────────────────────────────────────

export const createClientSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  goal: z.string().max(300).optional(),
  notes: z.string().max(1000).optional(),
  birthDate: z.string().optional(), // ISO date string
  height: z.number().int().positive().optional(), // cm
  initialWeight: z.number().positive().optional(), // kg (convertido a gramos al guardar)
});

// ─── Exercise ─────────────────────────────────────────────────────────────────

export const createExerciseSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  instructions: z.string().optional(),
  muscleGroups: z.array(z.string()).default([]),
  equipment: z.array(z.string()).default([]),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).default("intermediate"),
  videoUrl: z.string().url().optional().or(z.literal("")),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
});

// ─── Routine ──────────────────────────────────────────────────────────────────

export const createRoutineSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  durationWeeks: z.number().int().positive().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).default("intermediate"),
});

export const routineExerciseSchema = z.object({
  exerciseId: z.string().uuid(),
  order: z.number().int().default(0),
  sets: z.number().int().positive().default(3),
  repsMin: z.number().int().positive().optional(),
  repsMax: z.number().int().positive().optional(),
  rpe: z.number().int().min(1).max(10).optional(),
  restSeconds: z.number().int().positive().default(90),
  notes: z.string().optional(),
  weightKg: z.number().positive().optional(),
  tempo: z.string().optional(),
});

// ─── Workout Log ──────────────────────────────────────────────────────────────

export const logSetSchema = z.object({
  workoutLogId: z.string().uuid(),
  routineExerciseId: z.string().uuid().optional(),
  setNumber: z.number().int().positive(),
  weightGrams: z.number().int().positive().optional(),
  reps: z.number().int().positive().optional(),
  rpe: z.number().int().min(1).max(10).optional(),
  durationSeconds: z.number().int().positive().optional(),
  notes: z.string().optional(),
});

// ─── Goal ─────────────────────────────────────────────────────────────────────

export const createGoalSchema = z.object({
  clientId: z.string().uuid(),
  title: z.string().min(2),
  description: z.string().optional(),
  metricType: z.enum(["weight_kg", "adherence_pct", "lift_kg", "body_fat_pct", "custom"]),
  targetValue: z.number().optional(),
  deadline: z.string().optional(),
});

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const signInSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

export const signUpSchema = signInSchema.extend({
  name: z.string().min(2, "Mínimo 2 caracteres"),
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type CoachOnboarding = z.infer<typeof coachOnboardingSchema>;
export type CreateClient = z.infer<typeof createClientSchema>;
export type CreateExercise = z.infer<typeof createExerciseSchema>;
export type CreateRoutine = z.infer<typeof createRoutineSchema>;
export type LogSet = z.infer<typeof logSetSchema>;
export type CreateGoal = z.infer<typeof createGoalSchema>;
export type SignIn = z.infer<typeof signInSchema>;
export type SignUp = z.infer<typeof signUpSchema>;
