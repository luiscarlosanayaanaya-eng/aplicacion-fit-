import { pgTable, text, timestamp, uuid, varchar, boolean } from "drizzle-orm/pg-core";
import { coaches } from "./coaches";

export const exercises = pgTable("exercises", {
  id: uuid("id").primaryKey().defaultRandom(),
  coachId: uuid("coach_id").references(() => coaches.id, { onDelete: "cascade" }), // null = biblioteca global
  name: text("name").notNull(),
  description: text("description"),
  instructions: text("instructions"),
  videoUrl: text("video_url"),
  thumbnailUrl: text("thumbnail_url"),
  muscleGroups: text("muscle_groups").array().default([]).notNull(), // ["chest","triceps"]
  equipment: text("equipment").array().default([]).notNull(), // ["barbell","bench"]
  difficulty: varchar("difficulty", { length: 20 }).default("intermediate"), // beginner|intermediate|advanced
  isPublic: boolean("is_public").default(false).notNull(), // true = parte de la biblioteca global
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Exercise = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;
