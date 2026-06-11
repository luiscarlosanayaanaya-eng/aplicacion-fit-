import { pgTable, text, timestamp, uuid, varchar, integer, date } from "drizzle-orm/pg-core";
import { coaches } from "./coaches";

export const clients = pgTable("clients", {
  id: uuid("id").primaryKey().defaultRandom(),
  coachId: uuid("coach_id").notNull().references(() => coaches.id, { onDelete: "cascade" }),
  userId: uuid("user_id").unique(), // Supabase Auth (null hasta aceptar invitación)
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: varchar("phone", { length: 20 }),
  avatarUrl: text("avatar_url"),
  birthDate: date("birth_date"),
  height: integer("height"), // cm
  initialWeight: integer("initial_weight"), // gramos (evita decimales)
  goal: text("goal"),
  notes: text("notes"),
  status: varchar("status", { length: 20 }).notNull().default("active"), // active | inactive | invited
  inviteToken: text("invite_token"),
  inviteExpiresAt: timestamp("invite_expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;
