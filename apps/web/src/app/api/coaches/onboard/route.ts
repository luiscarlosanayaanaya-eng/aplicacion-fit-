import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@forja/db";
import { coaches } from "@forja/db";
import { coachOnboardingSchema } from "@forja/validators";
import { eq } from "drizzle-orm";

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

    const existing = await db
      .select({ id: coaches.id, userId: coaches.userId })
      .from(coaches)
      .where(eq(coaches.slug, slug))
      .limit(1);

    if (existing.length > 0 && existing[0]?.userId !== userId) {
      return NextResponse.json(
        { error: "Ese subdominio ya está en uso. Elige otro." },
        { status: 409 }
      );
    }

    const [coach] = await db
      .insert(coaches)
      .values({ userId, email, name, slug, brandColor: brandColor ?? "#6366f1" })
      .onConflictDoUpdate({
        target: coaches.userId,
        set: { name, slug, brandColor: brandColor ?? "#6366f1", updatedAt: new Date() },
      })
      .returning({ id: coaches.id });

    return NextResponse.json({ success: true, coachId: coach?.id });
  } catch (error) {
    console.error("[onboard]", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
