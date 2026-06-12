import { createClient } from "@supabase/supabase-js";

// Admin client using service role key — bypasses RLS, works over HTTPS (IPv4)
export const supabaseAdmin = createClient(
  process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
  process.env["SUPABASE_SERVICE_ROLE_KEY"]!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// Convert snake_case DB keys to camelCase to match Drizzle-inferred types
export function mapRow<T>(row: Record<string, unknown>): T {
  return Object.fromEntries(
    Object.entries(row).map(([k, v]) => [k.replace(/_([a-z])/g, (_, c) => c.toUpperCase()), v])
  ) as T;
}

export function mapRows<T>(rows: Record<string, unknown>[]): T[] {
  return rows.map((r) => mapRow<T>(r));
}
