import { pgTable, text, timestamp, uuid, varchar, integer } from "drizzle-orm/pg-core";

export const coaches = pgTable("coaches", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().unique(), // Supabase Auth user ID
  slug: varchar("slug", { length: 50 }).notNull().unique(), // subdominio
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  logoUrl: text("logo_url"),
  brandColor: varchar("brand_color", { length: 7 }).default("#6366f1"), // hex
  accentColor: varchar("accent_color", { length: 7 }).default("#8b5cf6"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: varchar("subscription_status", { length: 20 }).default("trialing"),
  trialEndsAt: timestamp("trial_ends_at", { withTimezone: true }),
  maxClients: integer("max_clients").default(10),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Coach = typeof coaches.$inferSelect;
export type NewCoach = typeof coaches.$inferInsert;
