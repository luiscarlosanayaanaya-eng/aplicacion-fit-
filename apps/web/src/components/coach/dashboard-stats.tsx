import { Users, ClipboardList, TrendingUp, Flame } from "lucide-react";
import { Card, CardContent } from "@forja/ui";

const stats = [
  { label: "Clientes activos", value: "0", icon: Users, change: "", color: "text-blue-500", bg: "bg-blue-50" },
  { label: "Rutinas creadas", value: "0", icon: ClipboardList, change: "", color: "text-violet-500", bg: "bg-violet-50" },
  { label: "Adherencia promedio", value: "—", icon: TrendingUp, change: "", color: "text-emerald-500", bg: "bg-emerald-50" },
  { label: "Rachas activas", value: "0", icon: Flame, change: "", color: "text-orange-500", bg: "bg-orange-50" },
];

export function DashboardStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex items-center gap-4 p-6">
            <div className={`rounded-xl ${stat.bg} p-3`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
