import { db, clients } from "@forja/db";
import { eq, desc } from "drizzle-orm";
import type { Client } from "@forja/db";

export async function getClients(coachId: string): Promise<Client[]> {
  try {
    return await db
      .select()
      .from(clients)
      .where(eq(clients.coachId, coachId))
      .orderBy(desc(clients.createdAt));
  } catch {
    return [];
  }
}

export async function getClient(id: string, coachId: string): Promise<Client | null> {
  try {
    const [client] = await db
      .select()
      .from(clients)
      .where(eq(clients.id, id))
      .limit(1);
    if (!client || client.coachId !== coachId) return null;
    return client;
  } catch {
    return null;
  }
}
