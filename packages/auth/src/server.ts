import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type CookieEntry = { name: string; value: string; options?: Record<string, unknown> };

export async function createServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
    process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setAll(cookiesToSet: CookieEntry[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              cookieStore.set(name, value, options as any)
            );
          } catch {}
        },
      },
    }
  );
}

export async function createServerSupabaseAdmin() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
    process.env["SUPABASE_SERVICE_ROLE_KEY"]!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieEntry[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              cookieStore.set(name, value, options as any)
            );
          } catch {}
        },
      },
    }
  );
}

export async function getSession() {
  const supabase = await createServerSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getUser() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
