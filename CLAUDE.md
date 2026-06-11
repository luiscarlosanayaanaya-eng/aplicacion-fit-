# Forja — SaaS White-Label para Coaches Fitness

## Qué es esto
Plataforma multi-tenant donde cada coach compra una suscripción y obtiene una app con su marca para gestionar clientes, rutinas, nutrición y progreso.

## Stack
- **Monorepo**: Turborepo + pnpm
- **Web**: Next.js 15 App Router + Tailwind v4 + shadcn/ui (apps/web)
- **Mobile**: Expo React Native + NativeWind (apps/mobile)
- **API**: tRPC (packages/api)
- **DB**: Supabase PostgreSQL + Drizzle ORM (packages/db)
- **Auth**: Supabase Auth (packages/auth)
- **Multi-tenancy**: RLS en Postgres + middleware por subdominio

## Comandos
```bash
pnpm dev              # Arranca todo en paralelo
pnpm --filter @forja/web dev     # Solo web
pnpm db:push          # Sync schema a Supabase (dev)
pnpm db:generate      # Genera migrations
pnpm db:studio        # Drizzle Studio (UI para la DB)
```

## Multi-tenancy
- Cada coach tiene un slug único → subdominio `{slug}.lvh.me:3000` en dev
- El middleware de Next.js lee el host, extrae el slug, y lo inyecta en headers
- RLS en Postgres garantiza que cada query solo ve datos del coach_id de la sesión

## Fases
- ✅ Fase 0: Cimientos (monorepo, DB schema, auth, middleware, theming)
- ⬜ Fase 1: Coach core (clientes, ejercicios, rutinas)
- ⬜ Fase 2: Client app móvil
- ⬜ Fase 3: Analytics + goals
- ⬜ Fase 4: Nutrición
- ⬜ Fase 5: Chat realtime
- ⬜ Fase 6: Stripe billing
- ⬜ Fase 7: IA (rutinas + foto comida)
- ⬜ Fase 8: White-label avanzado

## Variables de entorno
Copia `.env.example` → `.env.local` en `apps/web/` y llena con tus credenciales de Supabase.

## Convenciones
- TypeScript estricto en todo
- Server Components por defecto en Next.js (client components solo cuando necesario)
- Nombres de tablas en snake_case, tipos en PascalCase
- Cada tabla tiene `created_at`, `updated_at`, y `coach_id` (para RLS)
