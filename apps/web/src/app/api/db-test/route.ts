import { NextResponse } from "next/server";
import { db } from "@forja/db";
import { coaches } from "@forja/db";

export async function GET() {
  try {
    const result = await db.select({ id: coaches.id }).from(coaches).limit(1);
    return NextResponse.json({ ok: true, rows: result.length, dbUrl: (process.env["DATABASE_URL"] ?? "").slice(0, 35) + "..." });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    const cause = (error as { cause?: { message?: string; code?: string; detail?: string } })?.cause;
    return NextResponse.json({
      ok: false,
      error: msg,
      cause: cause ? { message: cause.message, code: cause.code, detail: cause.detail } : null,
      dbUrl: (process.env["DATABASE_URL"] ?? "").slice(0, 35) + "...",
    }, { status: 500 });
  }
}
