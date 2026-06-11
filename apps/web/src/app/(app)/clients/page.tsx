import React from "react";
import { getUser } from "@forja/auth/server";
import { redirect } from "next/navigation";
import { getCurrentCoach } from "@/lib/auth";
import { getClients } from "@/lib/queries/clients";
import { ClientsPageClient } from "./clients-page-client";

export const metadata = { title: "Clientes — Forja" };

export default async function ClientsPage(): Promise<React.JSX.Element> {
  const user = await getUser();
  if (!user) redirect("/login");

  const coach = await getCurrentCoach();
  if (!coach) redirect("/onboarding");

  const clientsList = await getClients(coach.id);

  return <ClientsPageClient clients={clientsList} />;
}
