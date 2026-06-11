import { pgTable, text, timestamp, uuid, varchar, boolean } from "drizzle-orm/pg-core";
import { coaches } from "./coaches";
import { clients } from "./clients";

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  coachId: uuid("coach_id").notNull().references(() => coaches.id, { onDelete: "cascade" }),
  clientId: uuid("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  senderRole: varchar("sender_role", { length: 10 }).notNull(), // "coach" | "client"
  senderUserId: uuid("sender_user_id").notNull(),
  content: text("content").notNull(),
  mediaUrl: text("media_url"),
  mediaType: varchar("media_type", { length: 20 }), // "image"|"video"|"audio"
  readAt: timestamp("read_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
