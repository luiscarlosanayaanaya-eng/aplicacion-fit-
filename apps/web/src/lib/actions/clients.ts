"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getUser } from "@forja/auth/server";
import { createClientSchema } from "@forja/validators";

async function getCoachId(): Promise<string | null> {
  try {
    const user = await getUser();
    if (!user) return null;
    const { data } = await supabaseAdmin
      .from("coaches")
      .select("id")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();
    return data?.id ?? null;
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
    const { error } = await supabaseAdmin.from("clients").insert({
      coach_id: coachId,
      name,
      email,
      phone,
      goal,
      notes,
      birth_date: birthDate,
      height,
      initial_weight: initialWeight ? Math.round(initialWeight * 1000) : undefined,
      status: "active",
    });
    if (error) {
      if (error.message.includes("unique") || error.message.includes("duplicate")) {
        return { error: "Ya existe un cliente con ese email." };
      }
      return { error: "Error al crear el cliente." };
    }
    revalidatePath("/clients");
    return { success: true };
  } catch {
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
    const { error } = await supabaseAdmin
      .from("clients")
      .update({
        ...parsed.data,
        birth_date: parsed.data.birthDate,
        initial_weight: parsed.data.initialWeight
          ? Math.round(parsed.data.initialWeight * 1000)
          : undefined,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("coach_id", coachId);
    if (error) return { error: "Error al actualizar el cliente." };
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
    const { error } = await supabaseAdmin
      .from("clients")
      .delete()
      .eq("id", id)
      .eq("coach_id", coachId);
    if (error) return { error: "Error al eliminar el cliente." };
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
    const { error } = await supabaseAdmin
      .from("clients")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("coach_id", coachId);
    if (error) return { error: "Error al actualizar estado." };
    revalidatePath("/clients");
    return { success: true };
  } catch {
    return { error: "Error al actualizar estado." };
  }
}
