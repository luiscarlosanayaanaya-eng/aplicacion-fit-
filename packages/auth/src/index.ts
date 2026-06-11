import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
    process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!
  );
}

export { createServerClient } from "@supabase/ssr";
export type { Session, User } from "@supabase/supabase-js";
