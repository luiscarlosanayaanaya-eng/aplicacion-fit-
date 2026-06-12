import { supabaseAdmin, mapRows, mapRow } from "@/lib/supabase-admin";
import type { Client } from "@forja/db";

export async function getClients(coachId: string): Promise<Client[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("clients")
      .select("*")
      .eq("coach_id", coachId)
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return mapRows<Client>(data as Record<string, unknown>[]);
  } catch {
    return [];
  }
}

export async function getClient(id: string, coachId: string): Promise<Client | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("clients")
      .select("*")
      .eq("id", id)
      .eq("coach_id", coachId)
      .limit(1)
      .maybeSingle();
    if (error || !data) return null;
    return mapRow<Client>(data as Record<string, unknown>);
  } catch {
    return null;
  }
}
