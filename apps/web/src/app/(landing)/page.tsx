import Link from "next/link";
import { ArrowRight, Dumbbell, BarChart3, Palette, Brain, Users, Shield } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ─── Nav ─────────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <span className="text-xl font-bold tracking-tight">
            <span className="text-brand">Forja</span>
          </span>
          <div className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Características
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Precios
            </Link>
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Iniciar sesión
            </Link>
            <Link
              href="/signup"
              className="rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand/90 transition-all"
            >
              Empezar gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-24">
        {/* Gradient background */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 animate-gradient"
          style={{
            background:
              "linear-gradient(135deg, #6366f1 0%, #8b5cf6 25%, #ec4899 50%, #6366f1 75%, #8b5cf6 100%)",
            opacity: 0.07,
          }}
        />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            White-label real. Sin comisiones. Con IA.
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">
            Tu marca.
            <br />
            <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#ec4899] bg-clip-text text-transparent">
              Tu app. Tu negocio.
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
            La plataforma todo-en-uno que permite a cada coach tener su propia app
            personalizada — rutinas, nutrición, seguimiento de clientes y análisis —
            sin pagar comisiones ni cruzar los dedos por el white-label.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-8 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-brand/90 transition-all active:scale-[0.98]"
            >
              Empieza gratis 14 días
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-8 py-3.5 text-base font-semibold hover:bg-muted transition-all"
            >
              Ver características
            </Link>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Sin tarjeta de crédito · Cancela cuando quieras
          </p>
        </div>
      </section>

      {/* ─── Social proof ────────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-muted/30 py-8">
        <div className="mx-auto max-w-4xl px-6">
          <p className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Lo que la competencia no puede ofrecer
          </p>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { label: "White-label", value: "Incluido", note: "vs $169 de setup extra" },
              { label: "Comisión sobre pagos", value: "0%", note: "vs 5% en TrueCoach" },
              { label: "IA de entrenamiento", value: "Nativa", note: "vs ninguno" },
              { label: "Apps iOS + Android", value: "Ambas", note: "vs solo iOS en TrueCoach" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-brand">{stat.value}</p>
                <p className="text-sm font-medium">{stat.label}</p>
                <p className="text-xs text-muted-foreground">{stat.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ────────────────────────────────────────────────────────── */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">Todo lo que necesita un coach serio</h2>
            <p className="text-muted-foreground">
              Construido para coaches que quieren escalar, no solo sobrevivir.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-border bg-card p-6 hover:border-brand/40 hover:shadow-lg transition-all duration-300"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand group-hover:bg-brand group-hover:text-white transition-all duration-300">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ─────────────────────────────────────────────────────────── */}
      <section id="pricing" className="bg-muted/30 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">Precio simple. Sin sorpresas.</h2>
            <p className="text-muted-foreground">Sin comisiones. Sin trampas. Un precio.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 ${
                  plan.featured
                    ? "border-brand bg-brand text-white shadow-2xl"
                    : "border-border bg-card"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent-brand px-4 py-1 text-xs font-bold text-white">
                    MÁS POPULAR
                  </div>
                )}
                <h3 className="mb-1 text-xl font-bold">{plan.name}</h3>
                <p className={`mb-6 text-sm ${plan.featured ? "text-white/70" : "text-muted-foreground"}`}>
                  {plan.description}
                </p>
                <div className="mb-8">
                  <span className="text-5xl font-bold">${plan.price}</span>
                  <span className={`text-sm ${plan.featured ? "text-white/70" : "text-muted-foreground"}`}>/mes</span>
                </div>
                <ul className="mb-8 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`block rounded-xl py-3 text-center text-sm font-semibold transition-all ${
                    plan.featured
                      ? "bg-white text-brand hover:bg-white/90"
                      : "bg-brand text-white hover:bg-brand/90"
                  }`}
                >
                  Empezar ahora
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Final ───────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-4 text-4xl font-bold">
            ¿Listo para forjar tu marca?
          </h2>
          <p className="mb-10 text-muted-foreground">
            Únete a cientos de coaches que ya tienen su app propia. 14 días gratis, sin tarjeta.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-10 py-4 text-base font-semibold text-white shadow-lg hover:bg-brand/90 transition-all"
          >
            Crear mi cuenta gratis
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Forja. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Palette,
    title: "White-label de verdad",
    description:
      "Tu logo, tus colores, tu subdominio. Los clientes ven solo tu marca — nunca la nuestra.",
  },
  {
    icon: Dumbbell,
    title: "Constructor de rutinas",
    description:
      "Crea rutinas con sets, reps, RPE y cronómetro de descanso. Arrastra y suelta para reordenar.",
  },
  {
    icon: BarChart3,
    title: "Analytics de progreso",
    description:
      "Ve quién cumple sus rutinas, qué ejercicios mejoran y cuándo intervenir antes de que un cliente abandone.",
  },
  {
    icon: Brain,
    title: "IA Copilot",
    description:
      "Describe el objetivo y el sistema genera la rutina base. Tú editas en 3 minutos, no 30.",
  },
  {
    icon: Users,
    title: "Gestión de clientes",
    description:
      "Invita clientes por email, asígna rutinas y planes, y ve el rendimiento individual en tiempo real.",
  },
  {
    icon: Shield,
    title: "Nutrición integrada",
    description:
      "Crea planes con macros, asígnalos a clientes y permite foto-logging de comidas con estimación automática.",
  },
];

const plans = [
  {
    name: "Starter",
    description: "Para coaches que están comenzando",
    price: 39,
    featured: false,
    features: [
      "Hasta 15 clientes",
      "App con tu marca",
      "Rutinas ilimitadas",
      "Cronómetro de descanso",
      "Nutrición básica",
      "Analytics esenciales",
    ],
  },
  {
    name: "Pro",
    description: "Para coaches que quieren escalar",
    price: 79,
    featured: true,
    features: [
      "Clientes ilimitados",
      "App con tu marca + subdominio",
      "IA para generar rutinas",
      "Foto-logging de comidas",
      "Chat en tiempo real",
      "Analytics avanzados",
      "Soporte prioritario",
    ],
  },
];
