import { getUser } from "@forja/auth/server";
import { db, coaches } from "@forja/db";
import { eq } from "drizzle-orm";
import type { Coach } from "@forja/db";

export async function getCurrentCoach(): Promise<Coach | null> {
  try {
    const user = await getUser();
    if (!user) return null;
    const [coach] = await db.select().from(coaches).where(eq(coaches.userId, user.id)).limit(1);
    return coach ?? null;
  } catch {
    return null;
  }
}
