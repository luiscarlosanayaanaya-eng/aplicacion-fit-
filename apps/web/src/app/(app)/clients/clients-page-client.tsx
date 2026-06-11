"use client";

import React, { useState } from "react";
import type { Client } from "@forja/db";
import { Button } from "@forja/ui";
import { UserPlus, Search } from "lucide-react";
import { ClientsTable } from "@/components/clients/clients-table";
import { ClientModal } from "@/components/clients/client-modal";
import { DashboardShell } from "@/components/coach/dashboard-shell";

interface ClientsPageClientProps {
  clients: Client[];
}

export function ClientsPageClient({ clients }: ClientsPageClientProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">
            {clients.length} cliente{clients.length !== 1 ? "s" : ""} en total
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Agregar cliente
        </Button>
      </div>

      {clients.length > 0 && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o email..."
            className="flex h-10 w-full max-w-sm rounded-xl border border-input bg-background pl-9 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      )}

      <ClientsTable clients={filtered} />

      <ClientModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </DashboardShell>
  );
}
