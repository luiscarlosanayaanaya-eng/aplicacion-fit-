import React from "react";
import { getUser } from "@forja/auth/server";
import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/coach/onboarding-form";

export const metadata = { title: "Configura tu marca" };

export default async function OnboardingPage(): Promise<React.JSX.Element> {
  const user = await getUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-16">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <span className="text-2xl font-bold text-brand">Forja</span>
          <h1 className="mt-4 text-2xl font-bold">Configura tu marca</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Esto es lo que verán tus clientes. Puedes cambiarlo después.
          </p>
        </div>
        <OnboardingForm userId={user.id} userEmail={user.email ?? ""} userName={user.user_metadata?.["name"] ?? ""} />
      </div>
    </div>
  );
}
