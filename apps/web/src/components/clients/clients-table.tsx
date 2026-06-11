"use client";

import React, { useState } from "react";
import type { Client } from "@forja/db";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  Badge, Button,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
} from "@forja/ui";
import { MoreHorizontal, Pencil, Trash2, UserCheck, UserX, Eye } from "lucide-react";
import Link from "next/link";
import { ClientModal } from "./client-modal";
import { deleteClient, updateClientStatus } from "@/lib/actions/clients";

interface ClientsTableProps {
  clients: Client[];
}

const STATUS_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  active: { label: "Activo", variant: "default" },
  inactive: { label: "Inactivo", variant: "secondary" },
  invited: { label: "Invitado", variant: "outline" },
};

export function ClientsTable({ clients }: ClientsTableProps) {
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este cliente? Esta acción no se puede deshacer.")) return;
    await deleteClient(id);
  }

  async function handleToggleStatus(client: Client) {
    const next = client.status === "active" ? "inactive" : "active";
    await updateClientStatus(client.id, next);
  }

  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-20 text-center">
        <p className="text-muted-foreground">No tienes clientes aún. Agrega tu primero.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Objetivo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => {
              const statusInfo = STATUS_LABELS[client.status] ?? STATUS_LABELS["active"]!;
              const initials = client.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

              return (
                <TableRow key={client.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-semibold text-brand">
                        {initials}
                      </div>
                      <div>
                        <p className="font-medium">{client.name}</p>
                        {client.phone && <p className="text-xs text-muted-foreground">{client.phone}</p>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{client.email}</TableCell>
                  <TableCell className="max-w-[200px]">
                    {client.goal ? (
                      <p className="truncate text-sm text-muted-foreground">{client.goal}</p>
                    ) : (
                      <span className="text-xs text-muted-foreground/50">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/clients/${client.id}`} className="flex items-center gap-2">
                            <Eye className="h-4 w-4" /> Ver perfil
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditingClient(client)}>
                          <Pencil className="h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(client)}>
                          {client.status === "active" ? (
                            <><UserX className="h-4 w-4" /> Desactivar</>
                          ) : (
                            <><UserCheck className="h-4 w-4" /> Activar</>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(client.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {editingClient && (
        <ClientModal
          open={!!editingClient}
          onClose={() => setEditingClient(null)}
          client={editingClient}
        />
      )}
    </>
  );
}
