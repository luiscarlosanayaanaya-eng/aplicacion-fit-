import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const { data, error, count } = await supabaseAdmin
      .from("coaches")
      .select("id", { count: "exact" });
    if (error) throw error;
    return NextResponse.json({ ok: true, rows: count ?? 0, data });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
