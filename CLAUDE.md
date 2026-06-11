# Forja — Technical Spec (CLAUDE.md)

> The technical bible for Forja. Read alongside `PROJECT_BRIEF.md` (product vision, ICP, pricing, roadmap). This document defines **how** we build: stack, architecture, schema, multi-tenancy, phase plan, and coding standards. When in doubt about a technical decision, this doc is the source of truth.

---

## 1. What we're building (one paragraph)

Forja is a white-label, AI-first SaaS for independent fitness coaches. Each coach gets a branded subdomain (`{slug}.forja.app`), a web dashboard to manage clients/routines/nutrition, and their clients get a polished mobile app (iOS + Android) to follow workouts, log sets, and chat with their coach. Multi-tenant from day one, AI features from Phase 7.

---

## 2. Stack (locked — do not change without updating this doc)

| Layer | Choice | Notes |
|---|---|---|
| Monorepo | **Turborepo + pnpm workspaces** | `apps/` + `packages/` |
| Web (coach dashboard + client web) | **Next.js 15** (App Router, RSC) | Deployed on Vercel |
| Mobile (client app) | **Expo (React Native)** | Expo Router, EAS builds post-MVP |
| API | **tRPC v11** | Shared router consumed by web + mobile |
| ORM | **Drizzle ORM** | Schema in `packages/db`, migrations via drizzle-kit |
| Database + Auth + Storage + Realtime | **Supabase** (PostgreSQL 15) | RLS for tenant isolation; Supabase Auth (email + Google OAuth) |
| Styling | **Tailwind CSS v4 + shadcn/ui** (web), **NativeWind** (mobile) | Theme tokens driven by per-tenant branding |
| Validation | **Zod** | Single source of truth for input schemas, shared in `packages/validators` |
| Payments | **Stripe** (Phase 6) | Coach SaaS subscriptions only; no client billing in MVP |
| AI | **Anthropic API (Claude)** (Phase 7) | Routine gen, meal photo analysis, copilot |
| Email | **Resend** | Transactional (invites, receipts) |
| Hosting | **Vercel** (web) + **Supabase cloud** | Wildcard domain `*.forja.app` on Vercel |
| Observability | Sentry (web + mobile) | Added in Phase 1 |

**Portability rule:** no Supabase-proprietary features that don't degrade gracefully to vanilla Postgres (RLS, triggers, and `auth.uid()` are fine; avoid edge-function lock-in for core logic — core logic lives in tRPC).

---

## 3. Monorepo structure

```
forja/
├── apps/
│   ├── web/          # Next.js 15 — coach dashboard + marketing + client web fallback
│   └── mobile/       # Expo — client app (coach mobile app Phase 5+)
├── packages/
│   ├── api/          # tRPC routers, procedures, context (tenant resolution)
│   ├── db/           # Drizzle schema, migrations, seed scripts, RLS policies (SQL)
│   ├── auth/         # Supabase auth helpers, session utilities
│   ├── validators/   # Zod schemas shared across api/web/mobile
│   ├── ui/           # Shared web components (shadcn-based)
│   └── config/       # Shared eslint, tsconfig, tailwind presets
├── turbo.json
├── pnpm-workspace.yaml
├── CLAUDE.md / PROJECT_BRIEF.md / .env.example
└── PHASE_X_SUMMARY.md  # one per completed phase
```

---

## 4. Multi-tenancy architecture

**Model:** single database, shared schema, row-level isolation via PostgreSQL RLS. The tenant is the **coach organization** (`tenants` table).

1. **Tenant resolution (web):** Next.js middleware parses the host. `{slug}.forja.app` → look up tenant by `slug` (cached), inject `tenantId` into request context. `app.forja.app` is the coach login/signup surface; `forja.app` is marketing.
2. **Tenant resolution (mobile):** client logs in → their membership row determines tenant; tenant id rides in the tRPC context from the session, never from client input.
3. **RLS:** every tenant-scoped table has `tenant_id uuid not null` + policy `tenant_id = (auth.jwt() ->> 'tenant_id')::uuid` (custom claim set at login via Supabase hook). Service-role access only in migrations/seeds/admin.
4. **tRPC context:** `protectedProcedure` (any authed user), `coachProcedure` (role coach/admin of tenant), `clientProcedure`. All queries via Drizzle **always filter by `tenantId` in code too** — defense in depth, RLS is the backstop, not the only guard.
5. **Theming:** `tenants.theme` JSONB (logo URL, primary/secondary colors, display name). Web reads it server-side into CSS variables; mobile fetches on login and themes NativeWind tokens.

---

## 5. Database schema (core MVP tables)

All tables: `id uuid pk default gen_random_uuid()`, `created_at`, `updated_at`. Tenant-scoped tables include `tenant_id`. Names in `snake_case`; Drizzle exports camelCase.

```
tenants            (slug unique, name, theme jsonb, plan, trial_ends_at, stripe_customer_id)
users              (supabase auth.users mirror: id, email, full_name, avatar_url)
memberships        (tenant_id, user_id, role: 'owner'|'coach'|'client', status: 'invited'|'active'|'archived', tags text[])
client_profiles    (tenant_id, user_id, goals, level, injuries/notes, metrics jsonb)
exercises          (tenant_id nullable → null = public seed library; name, muscle_groups text[], equipment, video_url, image_url, instructions)
routines           (tenant_id, coach_id, name, description, weeks, is_template bool)
routine_days       (routine_id, day_index, name)
routine_exercises  (routine_day_id, exercise_id, order, sets, reps, rest_seconds, rpe, tempo, notes)
assignments        (tenant_id, routine_id, client_user_id, starts_on, status)
workout_sessions   (tenant_id, assignment_id, client_user_id, routine_day_id, started_at, completed_at, notes)
set_logs           (session_id, routine_exercise_id, set_index, weight_kg, reps, rpe, completed bool)
nutrition_plans    (tenant_id, coach_id, client_user_id, name, target_kcal, protein_g, carbs_g, fat_g, notes)
meals              (nutrition_plan_id, name, order, description, kcal, protein_g, carbs_g, fat_g)
conversations      (tenant_id, coach_user_id, client_user_id) + messages (conversation_id, sender_id, body, read_at)  [Phase 5]
goals              (tenant_id, client_user_id, title, target_value, unit, due_date, status)  [Phase 5]
subscriptions      (tenant_id, stripe_subscription_id, plan, status, current_period_end)  [Phase 6]
```

Indexes: every `tenant_id`, plus hot paths (`set_logs.session_id`, `messages.conversation_id`, `assignments.client_user_id`).

---

## 6. Phase plan (MVP = Phases 0–6)

End **every** phase by writing `PHASE_X_SUMMARY.md` at repo root: what was built, key decisions, how to run it, what's next. Commit and push before declaring a phase done.

- **Phase 0 — Foundations** ⬅️ *current*
  Turborepo + pnpm scaffold; Next.js 15 app; Expo app boots; `packages/db` with Drizzle connected to Supabase; `packages/api` with a health-check tRPC route consumed by web; shared eslint/tsconfig/prettier; CI (GitHub Actions: typecheck + lint + build); `.env.example` kept current.
  **Done when:** `pnpm dev` runs web+mobile, a tRPC call round-trips to the DB, CI is green.

- **Phase 1 — Auth & Multi-tenancy**
  Supabase Auth (email + Google); coach signup → creates tenant + owner membership; onboarding wizard (name, slug, logo, colors); subdomain middleware + tenant context; RLS policies on all tables; tenant theming applied; Sentry.

- **Phase 2 — Clients & Exercise Library**
  Client invites (email via Resend) + accept flow; client list/profile/archive/tags; exercise library CRUD (private) + public seed (500+ exercises with media); search/filter by muscle group & equipment.

- **Phase 3 — Routine Builder & Assignment**
  Routine CRUD; drag/drop days + exercises (dnd-kit); per-exercise sets/reps/rest/RPE/tempo/notes; routine templates; assign to client(s) with start date.

- **Phase 4 — Client Mobile App: Workouts & Nutrition**
  Expo auth + tenant theming; today's workout; session UI (set logging, rest timer, exercise video); workout history & basic progress charts; nutrition plan view with macros.

- **Phase 5 — Chat, Analytics & Goals**
  Realtime 1:1 chat (Supabase Realtime) web + mobile; coach analytics dashboard (adherence, sessions completed, PRs); goal tracking; push notifications (Expo).

- **Phase 6 — Billing & Launch readiness**
  Stripe subscriptions (Starter $19 / Pro $39 / Studio $89), 14-day trial without card, webhooks, plan gating, billing portal; legal pages; production hardening.

- **Phase 7+ — AI features** (see `PROJECT_BRIEF.md` §6.2): routine generation, meal photo analysis, copilot, churn risk. Rate-limited per coach.

---

## 7. Coding standards

- **TypeScript strict** everywhere; no `any` (use `unknown` + narrowing).
- **Validation at the boundary:** every tRPC input is a Zod schema from `packages/validators`. Never trust client-provided `tenantId`.
- **Server Components by default** in Next.js; `"use client"` only when interactive.
- **Data access only through Drizzle** in tRPC procedures — no raw SQL in app code (SQL allowed in migrations/RLS files).
- **Naming:** DB `snake_case`; TS `camelCase`; components `PascalCase`; files `kebab-case.ts(x)`.
- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`) — small, scoped, descriptive.
- **Errors:** typed `TRPCError` with safe messages; never leak internals to clients.
- **Tests:** Vitest for `packages/api` business logic (tenant isolation tests are mandatory); Playwright smoke tests for critical web flows from Phase 2.
- **i18n-ready:** user-facing strings in ES + EN via dictionaries from Phase 1 (default ES).
- **Secrets:** never committed. `.env.local` per app; update `.env.example` whenever a var is added.
- **UI quality bar:** the client app carries the coach's brand — polish is a feature (see `PROJECT_BRIEF.md` §12.2).

---

## 8. Environment variables

See `.env.example`. The user (founder) pastes real values into `.env.local` when asked. Required from Phase 0: `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

---

## 9. Working agreement with Claude Code

1. Re-read this doc + latest `PHASE_X_SUMMARY.md` at the start of every session.
2. Stay in the current phase. New ideas → `BACKLOG.md`, not the current phase.
3. Ask the founder (in Spanish) when a product decision is ambiguous; check `PROJECT_BRIEF.md` §6/§12 first.
4. Commit and push frequently; never end a phase without `PHASE_X_SUMMARY.md`.
