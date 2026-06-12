import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Lazy-initialize so env vars are only read at request time, not at build time
let _admin: SupabaseClient | null = null;

function getAdmin(): SupabaseClient {
  if (!_admin) {
    _admin = createClient(
      process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
      process.env["SUPABASE_SERVICE_ROLE_KEY"]!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
  }
  return _admin;
}

// Proxy so callers can use `supabaseAdmin.from(...)` without any change
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return (getAdmin() as any)[prop];
  },
});

// Convert snake_case DB column names to camelCase to match Drizzle-inferred types
export function mapRow<T>(row: Record<string, unknown>): T {
  return Object.fromEntries(
    Object.entries(row).map(([k, v]) => [k.replace(/_([a-z])/g, (_, c) => c.toUpperCase()), v])
  ) as T;
}

export function mapRows<T>(rows: Record<string, unknown>[]): T[] {
  return rows.map((r) => mapRow<T>(r));
}
