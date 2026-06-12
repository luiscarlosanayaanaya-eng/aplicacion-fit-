import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { coachOnboardingSchema } from "@forja/validators";
import { supabaseAdmin } from "@/lib/supabase-admin";

const onboardSchema = coachOnboardingSchema.extend({
  userId: z.string().uuid(),
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = onboardSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { userId, email, name, slug, brandColor } = parsed.data;

    // Check slug uniqueness (allow same user to reuse their own slug)
    const { data: existing } = await supabaseAdmin
      .from("coaches")
      .select("id, user_id")
      .eq("slug", slug)
      .limit(1)
      .maybeSingle();

    if (existing && existing.user_id !== userId) {
      return NextResponse.json(
        { error: "Ese subdominio ya está en uso. Elige otro." },
        { status: 409 }
      );
    }

    // Upsert coach (insert or update on user_id conflict)
    const { data: coach, error } = await supabaseAdmin
      .from("coaches")
      .upsert(
        {
          user_id: userId,
          email,
          name,
          slug,
          brand_color: brandColor ?? "#6366f1",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
      .select("id")
      .single();

    if (error) {
      console.error("[onboard]", error);
      return NextResponse.json({ error: "Error al guardar. Intenta de nuevo." }, { status: 500 });
    }

    return NextResponse.json({ success: true, coachId: coach?.id });
  } catch (error) {
    console.error("[onboard]", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
