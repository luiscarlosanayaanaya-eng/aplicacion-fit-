"use client";

import React, { useState, useTransition } from "react";
import type { Client } from "@forja/db";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@forja/ui";
import { Button, Input, Label, Textarea, Select } from "@forja/ui";
import { createClient, updateClient } from "@/lib/actions/clients";

interface ClientModalProps {
  open: boolean;
  onClose: () => void;
  client?: Client;
}

export function ClientModal({ open, onClose, client }: ClientModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = client
        ? await updateClient(client.id, formData)
        : await createClient(formData);

      if ("error" in result && result.error) {
        setError(typeof result.error === "string" ? result.error : "Revisa los campos.");
      } else {
        onClose();
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{client ? "Editar cliente" : "Agregar cliente"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nombre *</Label>
              <Input id="name" name="name" defaultValue={client?.name} required placeholder="Carlos Gómez" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" defaultValue={client?.email} required placeholder="carlos@email.com" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" name="phone" defaultValue={client?.phone ?? ""} placeholder="+52 55 1234 5678" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="birthDate">Fecha de nacimiento</Label>
              <Input id="birthDate" name="birthDate" type="date" defaultValue={client?.birthDate ?? ""} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="height">Altura (cm)</Label>
              <Input id="height" name="height" type="number" defaultValue={client?.height ?? ""} placeholder="175" min={100} max={250} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="initialWeight">Peso inicial (kg)</Label>
              <Input
                id="initialWeight"
                name="initialWeight"
                type="number"
                step="0.1"
                defaultValue={client?.initialWeight ? client.initialWeight / 1000 : ""}
                placeholder="75.5"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="goal">Objetivo</Label>
            <Input id="goal" name="goal" defaultValue={client?.goal ?? ""} placeholder="Perder 10 kg en 6 meses" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notas internas</Label>
            <Textarea id="notes" name="notes" defaultValue={client?.notes ?? ""} placeholder="Lesión en rodilla derecha, evitar sentadillas profundas..." rows={3} />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : client ? "Actualizar" : "Crear cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
