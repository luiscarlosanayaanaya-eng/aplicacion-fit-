import React from "react";
import { getUser } from "@forja/auth/server";
import { redirect } from "next/navigation";
import { getCurrentCoach } from "@/lib/auth";
import { getMyExercises, getGlobalExercises } from "@/lib/queries/exercises";
import { ExercisesPageClient } from "./exercises-page-client";

export const metadata = { title: "Ejercicios — Forja" };

export default async function ExercisesPage(): Promise<React.JSX.Element> {
  const user = await getUser();
  if (!user) redirect("/login");

  const coach = await getCurrentCoach();
  if (!coach) redirect("/onboarding");

  const [myExercises, globalExercises] = await Promise.all([
    getMyExercises(coach.id),
    getGlobalExercises(),
  ]);

  return (
    <ExercisesPageClient myExercises={myExercises} globalExercises={globalExercises} />
  );
}
