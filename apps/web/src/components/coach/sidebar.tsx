"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  ClipboardList,
  Salad,
  MessageCircle,
  Settings,
  LogOut,
  Target,
} from "lucide-react";
import { cn } from "@forja/ui";
import { logout } from "@/lib/actions/auth";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/clients", icon: Users, label: "Clientes" },
  { href: "/exercises", icon: Dumbbell, label: "Ejercicios" },
  { href: "/routines", icon: ClipboardList, label: "Rutinas" },
  { href: "/nutrition", icon: Salad, label: "Nutrición" },
  { href: "/goals", icon: Target, label: "Metas" },
  { href: "/messages", icon: MessageCircle, label: "Mensajes" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-border">
        <span className="text-xl font-bold text-brand">Forja</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                    active
                      ? "bg-brand text-white"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom */}
      <div className="border-t border-border p-3 space-y-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
        >
          <Settings className="h-4 w-4" />
          Configuración
        </Link>
        <form action={logout}>
          <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all">
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}
