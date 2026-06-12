import { getUser } from "@forja/auth/server";
import { supabaseAdmin, mapRow } from "@/lib/supabase-admin";
import type { Coach } from "@forja/db";

export async function getCurrentCoach(): Promise<Coach | null> {
  try {
    const user = await getUser();
    if (!user) return null;
    const { data, error } = await supabaseAdmin
      .from("coaches")
      .select("*")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();
    if (error || !data) return null;
    return mapRow<Coach>(data as Record<string, unknown>);
  } catch {
    return null;
  }
}
