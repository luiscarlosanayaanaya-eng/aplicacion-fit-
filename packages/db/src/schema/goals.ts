import { pgTable, text, timestamp, uuid, integer, varchar, boolean } from "drizzle-orm/pg-core";
import { coaches } from "./coaches";
import { clients } from "./clients";

export const goals = pgTable("goals", {
  id: uuid("id").primaryKey().defaultRandom(),
  coachId: uuid("coach_id").notNull().references(() => coaches.id, { onDelete: "cascade" }),
  clientId: uuid("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  metricType: varchar("metric_type", { length: 30 }).notNull(), // "weight_kg"|"adherence_pct"|"lift_kg"|"body_fat_pct"|"custom"
  targetValue: integer("target_value"), // en la unidad del metricType (gramos para peso, % * 100 para porcentajes)
  currentValue: integer("current_value"),
  deadline: timestamp("deadline", { withTimezone: true }),
  achieved: boolean("achieved").default(false).notNull(),
  achievedAt: timestamp("achieved_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Goal = typeof goals.$inferSelect;
export type NewGoal = typeof goals.$inferInsert;
