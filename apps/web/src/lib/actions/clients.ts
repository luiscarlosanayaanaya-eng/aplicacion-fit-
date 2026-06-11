"use server";

import { revalidatePath } from "next/cache";
import { db, coaches, clients } from "@forja/db";
import { eq } from "drizzle-orm";
import { getUser } from "@forja/auth/server";
import { createClientSchema } from "@forja/validators";

async function getCoachId(): Promise<string | null> {
  try {
    const user = await getUser();
    if (!user) return null;
    const [coach] = await db.select({ id: coaches.id }).from(coaches).where(eq(coaches.userId, user.id)).limit(1);
    return coach?.id ?? null;
  } catch {
    return null;
  }
}

export async function createClient(formData: FormData) {
  const coachId = await getCoachId();
  if (!coachId) return { error: "No autorizado" };

  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: (formData.get("phone") as string) || undefined,
    goal: (formData.get("goal") as string) || undefined,
    notes: (formData.get("notes") as string) || undefined,
    birthDate: (formData.get("birthDate") as string) || undefined,
    height: formData.get("height") ? Number(formData.get("height")) : undefined,
    initialWeight: formData.get("initialWeight") ? Number(formData.get("initialWeight")) : undefined,
  };

  const parsed = createClientSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  try {
    const { name, email, phone, goal, notes, birthDate, height, initialWeight } = parsed.data;
    await db.insert(clients).values({
      coachId,
      name,
      email,
      phone,
      goal,
      notes,
      birthDate,
      height,
      initialWeight: initialWeight ? Math.round(initialWeight * 1000) : undefined,
      status: "active",
    });
    revalidatePath("/clients");
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error desconocido";
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return { error: "Ya existe un cliente con ese email." };
    }
    return { error: "Error al crear el cliente." };
  }
}

export async function updateClient(id: string, formData: FormData) {
  const coachId = await getCoachId();
  if (!coachId) return { error: "No autorizado" };

  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: (formData.get("phone") as string) || undefined,
    goal: (formData.get("goal") as string) || undefined,
    notes: (formData.get("notes") as string) || undefined,
    birthDate: (formData.get("birthDate") as string) || undefined,
    height: formData.get("height") ? Number(formData.get("height")) : undefined,
    initialWeight: formData.get("initialWeight") ? Number(formData.get("initialWeight")) : undefined,
  };

  const parsed = createClientSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  try {
    await db
      .update(clients)
      .set({
        ...parsed.data,
        initialWeight: parsed.data.initialWeight
          ? Math.round(parsed.data.initialWeight * 1000)
          : undefined,
        updatedAt: new Date(),
      })
      .where(eq(clients.id, id));
    revalidatePath("/clients");
    revalidatePath(`/clients/${id}`);
    return { success: true };
  } catch {
    return { error: "Error al actualizar el cliente." };
  }
}

export async function deleteClient(id: string) {
  const coachId = await getCoachId();
  if (!coachId) return { error: "No autorizado" };

  try {
    await db.delete(clients).where(eq(clients.id, id));
    revalidatePath("/clients");
    return { success: true };
  } catch {
    return { error: "Error al eliminar el cliente." };
  }
}

export async function updateClientStatus(id: string, status: "active" | "inactive") {
  const coachId = await getCoachId();
  if (!coachId) return { error: "No autorizado" };

  try {
    await db.update(clients).set({ status, updatedAt: new Date() }).where(eq(clients.id, id));
    revalidatePath("/clients");
    return { success: true };
  } catch {
    return { error: "Error al actualizar estado." };
  }
}
