"use server";

import { createServerSupabase } from "@forja/auth/server";
import { redirect } from "next/navigation";

export async function logout() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/login");
}
