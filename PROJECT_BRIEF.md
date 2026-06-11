# Forja — Project Brief & Product Vision

> The strategic north star for Forja. Read alongside `CLAUDE.md` (which is the technical spec). This document answers **what we're building, why, for whom, and where it's going.** When in doubt about a product decision, this doc and `CLAUDE.md` are the sources of truth.

---

## 1. Status snapshot (resume from here)

**Project name:** Forja
**Stage:** Pre-development. Architecture and spec complete. About to start Phase 0 implementation.

**Decisions locked:**
- Stack: TypeScript monorepo (Turborepo) — Next.js 15 web + Expo mobile + tRPC + Drizzle + Supabase + Vercel
- Multi-tenancy: subdomain-based (`{slug}.forja.app`) with PostgreSQL RLS
- White-label depth: theming + per-coach subdomain (native white-label app per coach is post-MVP)
- Billing model: Forja charges coaches a SaaS subscription; coaches handle their own client billing externally (Stripe Connect deferred)
- Brand: "Forja" — verified clean in fitness/SaaS space

**Files created so far (at repo root):**
- `CLAUDE.md` — technical bible (stack, schema, multi-tenancy, phase plan, coding standards)
- `.env.example` — environment variables template
- `INITIAL_PROMPT.md` — kickoff prompt for Claude Code
- `PROJECT_BRIEF.md` — this document

**Current phase:** Phase 0 — Foundations (not yet started)

**What's pending from user:**
- Supabase project credentials (to be pasted into `.env.local` when Claude Code asks)
- Claude Code installed in VS Code

**How to resume in a new Claude Code session:**
> "Lee `CLAUDE.md` y `PROJECT_BRIEF.md` en la raíz. Lee también el `PHASE_X_SUMMARY.md` más reciente para ver dónde quedamos. Continúa desde ahí."

---

## 2. The product, in one sentence

**Forja is the white-label, AI-first operating system for independent fitness coaches — it gives them their own branded app, eliminates the admin grind, and uses AI to make them better coaches, not replace them.**

## 3. The thesis

The personal training market is a $14B+ industry growing 8% annually. There are roughly **400,000+ certified personal trainers worldwide**, and the vast majority either: (a) cobble together Google Docs + WhatsApp + spreadsheets, or (b) pay 2–3x too much for legacy software that wasn't built in the last decade.

The category leaders (Trainerize, TrueCoach, Everfit, FitBudd, Virtuagym) share four chronic flaws:

1. **They gatekeep white-label** — charging $145–$225/month extra or $169 setup fees for what should be a baseline feature.
2. **They tax payment flows** — TrueCoach takes 5% off every client payment.
3. **They have no real AI** — at best, a chatbot. None has true AI-assisted programming, nutrition planning, or form analysis built in.
4. **Their UX is dated** — most still feel like 2018 SaaS dashboards.

Forja attacks all four simultaneously. We are not "Trainerize but cheaper." We are what a fitness coaching platform built in 2026 should look like.

## 4. Who we're for (ICP)

**Primary buyer (today): the independent online coach.**
- 25–40 years old, certified PT (NASM, ACE, ISSA, NSCA)
- 10–80 active clients, mostly remote
- Charges $80–$300/month per client
- Active on Instagram/TikTok (built audience there)
- Currently uses 4+ tools (Google Docs, WhatsApp, Excel, Cronometer, Stripe links)
- Pain: spends 30–50% of work time on admin, not coaching
- Earns $3K–$15K/month from coaching, wants to scale to $25K+

**Secondary buyer (Phase 6+): the coaching studio / gym.**
- 2–10 coaches under one brand
- Mix of online and in-person clients
- Needs team features, shared exercise library, branded experience for their gym

**End user (the client/athlete):**
- 22–55 years old, paying $80–$300/month for online coaching
- Trains in their own gym or home, follows the program their coach gave them
- Wants: clear daily plan, easy logging, accountability, results
- Currently frustrated with: cluttered apps, lost messages, programs in PDFs

## 5. Why we win (the moat)

| Dimension | Incumbents | Forja |
|---|---|---|
| White-label theming | $145–$225/mo addon | Included in $29/mo base |
| Subdomain per coach | Premium tier only | Included on all plans |
| Payment processing | 5% commission (TrueCoach) | Coach keeps 100% (handles externally for MVP) |
| AI routine generation | Not available | Native, with editable output |
| AI nutrition + photo logging | Not available | Native (Phase 7) |
| Auto-progressive overload | Manual | Automatic via RPE (unique) |
| Hands-free workout mode | Not available | Voice-controlled (Phase 8) |
| Mobile app for coach | Limited or none | Full coach mobile app (Phase 5+) |
| Wearables integration | Limited (Apple Health only) | Apple Health + Google Fit + Garmin + Whoop + Oura (v2) |
| Pricing | $19–$249/mo by client count | Flat tiers, no per-client gouging |
| Modern UX | Mixed | Best-in-class (shadcn/ui, Tailwind v4) |

**Three of these are sufficient. Together they make Forja a category-defining product.**

---

## 6. The full product (everything Forja will eventually be)

This is the **complete vision**. We won't build all of this at once — `CLAUDE.md` defines the MVP scope. But every architectural decision today should be compatible with this end state.

### 6.1 Core platform (MVP — Phases 0–6)

- ✅ Multi-tenant white-label (theming + subdomain)
- ✅ Coach signup with onboarding wizard
- ✅ Client management (invite, profile, archive, tags)
- ✅ Exercise library (private + public seed of 500+ exercises with video/image)
- ✅ Routine builder (drag/drop days + exercises, sets/reps/rest/RPE/tempo/notes)
- ✅ Routine assignment to clients
- ✅ Client mobile app (Expo, iOS + Android)
- ✅ Workout session UI with rest timer, set logging, exercise videos
- ✅ Workout history and basic progress
- ✅ Nutrition plans with macros
- ✅ Real-time chat (1:1 coach ↔ client)
- ✅ Analytics dashboard (adherence, performance)
- ✅ Goal tracking
- ✅ Stripe subscription billing for coaches
- ✅ 14-day free trial

### 6.2 AI features (Phase 7)

- 🤖 **AI Coach Copilot**: generates routine drafts from goal + level + days/week + restrictions, fully editable
- 🤖 **AI nutrition planner**: generates meal plans from target macros + dietary preferences + allergies
- 🤖 **AI meal photo analysis**: client takes a photo of their plate, vision model estimates calories + macros + portion size
- 🤖 **AI client risk detection**: flags clients likely to churn based on adherence drop, no-shows, message sentiment
- 🤖 **AI weekly report generator**: writes the coach's weekly check-in to each client (coach edits before sending)
- 🤖 **AI exercise substitution**: client says "no equipment today" → AI swaps for bodyweight alternatives keeping the stimulus
- 🤖 **Voice notes transcription**: coach records a voice memo, gets text + AI summary
- 🤖 **AI chatbot for clients**: "when's my next workout?", "what's a good substitute for incline press?" — branded with coach's voice

### 6.3 Coach business tools (Phase 8–10)

- 📊 Advanced analytics: cohort comparisons, churn analysis, revenue forecasting
- 📧 Email + SMS marketing: drip campaigns, broadcast messages, re-engagement flows (vs Mailchimp + Twilio)
- 📅 Calendar + bookings: 1:1 sessions, group classes, video calls (replaces Calendly)
- 🎥 Video coaching: record and send form feedback videos in-app
- 🏃 Live streaming: group classes via WebRTC (vs Zoom)
- 📝 Forms and questionnaires: PAR-Q, intake forms, weekly check-ins, satisfaction surveys
- 🧾 Templates marketplace: coaches sell/share programs to other coaches (Forja takes small cut)
- 👥 Multi-coach teams: head coach + assistants with role-based permissions
- 🏷️ Client segmentation: tags, smart segments ("clients who missed 3+ sessions this month")
- 📈 Sales pages: built-in landing page builder for coach's funnel
- 🎁 Affiliate program: coaches earn for referring other coaches to Forja
- 📲 Coach mobile app: native iOS/Android app for the coach side (Phase 5)

### 6.4 Client experience deepening (Phase 9+)

- ⌚ **Wearables**: Apple Health, Google Fit, Garmin, Whoop, Oura, Polar, Fitbit
- 💓 Heart rate during workouts, recovery scoring
- 🛌 Sleep, HRV, readiness scoring
- 🚶 GPS tracking for cardio (runs, walks, cycling)
- 🥤 Habit tracker (water, supplements, steps, mood, energy)
- 📸 Body measurements + progress photos with timeline
- 📅 Weekly check-ins (weight, photos, energy, sleep — auto-sent to coach)
- 🎙️ **Hands-free voice mode**: "next set", "start rest timer", read next exercise name aloud — critical UX win in the gym
- 🥗 Recipe database with macros (1000+ seeded)
- 🛒 Grocery list generator from meal plan
- 🔍 Barcode scanner for food logging
- 📲 Restaurant menu search (lookup macros for chain restaurants)
- 🩸 Period tracker for women's health programming
- 🔥 Streaks + XP + achievements + leaderboards (within coach's brand)
- 🏆 Auto-PR detection and celebration
- 👥 Community: private brand-scoped feed (clients post wins, coach reacts/comments)

### 6.5 Innovation layer (Phase 11+)

- 🎯 **Computer vision rep counter**: phone camera counts your reps automatically — no manual log needed
- 📐 **AI form check**: client records a set, AI flags issues (depth, knee tracking, bar path)
- 🪞 **AR mirror mode**: phone propped up acts as a mirror with overlays (rep count, tempo guide, RPE prompt)
- 💡 Smart rest timer: detects HR recovery, suggests when you're ready for next set
- 🧠 Predictive adherence: tells coach "Sarah will likely drop off in 2 weeks unless intervened"
- 📊 Industry benchmarks: anonymous cohort data ("your retention is in top 20% of coaches")
- 🤝 **Coach-to-coach mentorship marketplace**: senior coaches sell mentorship to junior coaches
- 🌐 Custom domains per coach (CNAME + auto SSL)
- 📱 **Native white-label apps**: each coach gets their own app in App Store + Play Store under their brand (Phase 11+, requires CI/CD pipeline for automated app builds via Expo EAS)

### 6.6 Platform/infrastructure (built incrementally, not user-facing)

- 🔐 GDPR compliance, data export, account deletion flows
- 🏥 Health data handling best practices (not HIPAA-required since we're consumer, but treat health data with care)
- 🌍 Internationalization: ES + EN at MVP, PT + FR + DE at v1.5
- 💱 Multi-currency for coach pricing displays
- 🚨 Observability: Sentry, OpenTelemetry, structured logs
- 🚀 Feature flags (PostHog or Vercel Flags)
- 🧪 A/B testing framework
- 📊 Data warehouse for analytics (Postgres → Tinybird/ClickHouse for heavy queries when scale demands)
- ✉️ Transactional email (Resend) + marketing email (deferred)
- 📬 SMS + WhatsApp Business API for notifications (important in LATAM)
- 🔄 Backup + disaster recovery
- 📜 Compliance/audit logs
- 🔧 Admin panel for Forja team (handle support, refunds, abuse)

---

## 7. Pricing strategy

All plans include white-label theming, subdomain, and unlimited workouts.

| Plan | Price | Clients | Highlights |
|---|---|---|---|
| **Forja Starter** | $19/mo | up to 15 | All MVP features, branding, mobile app |
| **Forja Pro** ⭐ | $39/mo | unlimited | + AI routine gen, AI meal photo, advanced analytics |
| **Forja Studio** | $89/mo | unlimited | Pro + multi-coach (up to 5), templates marketplace access, priority support |
| **Forja Enterprise** | Custom | unlimited | Studio + custom domain, native white-label apps, SLA, dedicated support |

- **14-day free trial** on all plans, no credit card required
- **Annual discount**: 2 months free if paid annually
- **Founding coach offer** (first 100 coaches): lock in $19/mo Pro tier for life

**Why this pricing wins:**
- ~2x cheaper than TrueCoach for equivalent features
- No per-client gouging (vs Trainerize's $5–$80 sliding scale)
- 0% commission on coach's client payments (vs TrueCoach 5%)

**Unit economics target (after 12 months):**
- Average revenue per coach (ARPC): $35/mo
- Gross margin: >80% (Vercel + Supabase + Stripe + Anthropic ≈ $5–8 per coach per month at scale)
- CAC payback: <4 months
- Net revenue retention: >100% (upsells from Starter → Pro → Studio)

---

## 8. Go-to-market

We are not building Forja and praying. The launch sequence:

**Phase A — Closed beta (10 coaches, free)**
Recruit 10 coaches from your personal network or Instagram DMs. Free access in exchange for: weekly feedback calls, public testimonial when launched, case study material.

**Phase B — Founding coaches (100 coaches, $19/mo lifetime Pro)**
Launch on Twitter/Instagram fitness communities. ProductHunt launch. Founding coach offer creates urgency and word-of-mouth.

**Phase C — Content + SEO (months 4–9)**
Programmatic SEO targeting "[city] personal trainer software", "Trainerize alternative", "white-label coaching app". Long-form content from real coaches.

**Phase D — Coach affiliate program (months 9+)**
Coaches earn 20% recurring for 12 months on each coach they refer. Compounds fast.

**Phase E — Studios + gyms (months 12+)**
Direct sales to small chains (2–10 location studios) with Studio + Enterprise tiers.

---

## 9. Roadmap (12-month view)

**Quarter 1 (now)**
- Phases 0–4: foundations through nutrition
- Closed beta with 10 coaches
- Brand identity, landing page

**Quarter 2**
- Phases 5–6: chat realtime + Stripe billing
- Public launch with founding coach offer
- Target: 100 paying coaches

**Quarter 3**
- Phase 7: AI features (routine gen, meal photo, copilot)
- Coach mobile app (native)
- Target: 500 paying coaches

**Quarter 4**
- Phase 8+: deep white-label, custom domains, calendar, video coaching
- Affiliate program live
- Begin Studio tier sales
- Target: 1,500 paying coaches, $50K MRR

---

## 10. Success metrics

**North star metric:** Weekly Active Coaches (WAC) — coaches who logged in and did at least one meaningful action (created a routine, sent a message, reviewed a client's session) in the last 7 days.

**Health metrics:**
- WAU coach / MAU coach > 60%
- WAU client / MAU client > 50%
- Coach 90-day retention > 80%
- Client 90-day retention > 70% (the coach's clients staying with the coach)
- NPS from coaches > 50
- Time-to-first-routine-assigned: < 30 minutes from signup

**Business metrics:**
- MRR
- Net new ARR
- ARPC trend (should grow as Pro and Studio adoption increases)
- LTV:CAC > 3:1

---

## 11. Risks and how we mitigate

| Risk | Mitigation |
|---|---|
| Competitor copies white-label pricing | Speed: ship the AI features they can't match in 6 months |
| Coach churn due to low client adoption | Onboarding wizard helps coach migrate 5 existing clients in first session; client app UX is best-in-class |
| Supabase scaling limits | Architecture is portable (vanilla Postgres + Drizzle); can migrate to RDS/Aurora later. RLS-based multi-tenancy works on any Postgres |
| App Store rejection of white-label apps | Phase 11+ handles via Expo EAS with proper review documentation; not blocking MVP |
| AI cost runaway | Rate-limit per coach (e.g. 50 routine generations / 100 meal photos per month on Pro); upsell to higher tiers for more |
| LATAM payment friction | Stripe in Phase 6 (USD); add MercadoPago and local methods in Phase 9 |

---

## 12. Working principles

These guide both product decisions and how we work with Claude Code.

1. **Coach time is sacred.** Every feature is judged by: does this save the coach time or make them money? If neither, kill it or defer it.
2. **The client experience must be polished.** Coaches sell their brand. If our client app looks cheap, they won't put their brand on it.
3. **Ship to learn, not to perfect.** MVP is enough to be useful, not enough to be done. Iterate based on real coach feedback.
4. **Optimize for retention over acquisition.** Acquisition is a marketing problem we can solve later. Retention requires the product to actually work.
5. **AI augments, never replaces.** The coach is the expert. AI removes drudgery, suggests starting points, surfaces patterns — the coach decides.
6. **Compound features over one-off features.** A feature that makes 3 other features better (e.g. tags, templates) beats a standalone shiny one (e.g. dance workouts).
7. **Don't build what someone else does better.** If we need email marketing, integrate ConvertKit before building our own. If we need video calls, embed Daily.co before building WebRTC.

---

## 13. References to other docs

- **`CLAUDE.md`** — technical bible: stack, schema, multi-tenancy, phase plan, coding standards. The how.
- **`.env.example`** — environment variable template
- **`INITIAL_PROMPT.md`** — kickoff prompt for Claude Code (Phase 0)
- **`PHASE_X_SUMMARY.md`** — created at the end of each phase by Claude Code, documents what was built and what comes next
- **`PROJECT_BRIEF.md`** (this doc) — the what and the why

---

## 14. How to use this document going forward

**Before starting any new phase:** re-read sections 6 (full product), 9 (roadmap), and 12 (principles). Make sure the next phase's scope still fits the strategy.

**When Claude Code asks a product question:** check section 6 for whether the feature is in scope, then sections 9 and 12 for prioritization.

**When you (the founder) feel scope creep:** read section 12, principle 1, 3, and 7. Most "wouldn't it be cool if..." ideas should go into a `BACKLOG.md` instead of into the current phase.

**When something changes (new competitor, new feature idea, market feedback):** update section 5 (moat) or section 6 (features) and commit the change. This doc evolves with the business.

**When restarting Claude Code in a new session:** paste this prompt:
> "Lee `CLAUDE.md`, `PROJECT_BRIEF.md`, y el `PHASE_X_SUMMARY.md` más reciente. Después de leerlos, hazme un resumen de 5 líneas de dónde estamos y propón el siguiente paso."

That gets a fresh Claude Code session into full context in under a minute.
