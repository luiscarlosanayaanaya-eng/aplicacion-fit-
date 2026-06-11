import { pgTable, text, timestamp, uuid, integer, varchar, boolean } from "drizzle-orm/pg-core";
import { coaches } from "./coaches";
import { clients } from "./clients";

export const nutritionPlans = pgTable("nutrition_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  coachId: uuid("coach_id").notNull().references(() => coaches.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  targetCalories: integer("target_calories"),
  targetProteinG: integer("target_protein_g"),
  targetCarbsG: integer("target_carbs_g"),
  targetFatG: integer("target_fat_g"),
  isTemplate: boolean("is_template").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const nutritionMeals = pgTable("nutrition_meals", {
  id: uuid("id").primaryKey().defaultRandom(),
  planId: uuid("plan_id").notNull().references(() => nutritionPlans.id, { onDelete: "cascade" }),
  name: text("name").notNull(), // "Desayuno", "Almuerzo"
  order: integer("order").notNull().default(0),
  timeHint: varchar("time_hint", { length: 10 }), // "08:00"
  calories: integer("calories"),
  proteinG: integer("protein_g"),
  carbsG: integer("carbs_g"),
  fatG: integer("fat_g"),
  foods: text("foods"), // JSON string con lista de alimentos [{name, amount, unit}]
  notes: text("notes"),
});

export const nutritionAssignments = pgTable("nutrition_assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  coachId: uuid("coach_id").notNull().references(() => coaches.id, { onDelete: "cascade" }),
  clientId: uuid("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  planId: uuid("plan_id").notNull().references(() => nutritionPlans.id),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type NutritionPlan = typeof nutritionPlans.$inferSelect;
export type NutritionMeal = typeof nutritionMeals.$inferSelect;
export type NutritionAssignment = typeof nutritionAssignments.$inferSelect;
