import React from "react";
import { getUser } from "@forja/auth/server";
import { redirect } from "next/navigation";
import { getCurrentCoach } from "@/lib/auth";
import { getRoutines } from "@/lib/queries/routines";
import { RoutinesPageClient } from "./routines-page-client";

export const metadata = { title: "Rutinas — Forja" };

export default async function RoutinesPage(): Promise<React.JSX.Element> {
  const user = await getUser();
  if (!user) redirect("/login");

  const coach = await getCurrentCoach();
  if (!coach) redirect("/onboarding");

  const routinesList = await getRoutines(coach.id);

  return <RoutinesPageClient routines={routinesList} />;
}
