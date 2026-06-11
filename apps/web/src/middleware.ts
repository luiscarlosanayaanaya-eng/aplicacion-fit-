import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const ROOT_DOMAIN = process.env["NEXT_PUBLIC_ROOT_DOMAIN"] ?? "lvh.me";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") ?? "";

  // Extrae el subdominio: "pepe.lvh.me" → "pepe"
  const subdomain = hostname
    .replace(`.${ROOT_DOMAIN}`, "")
    .replace(`:3000`, "")
    .replace(`:${process.env["PORT"] ?? "3000"}`, "");

  const isRootDomain =
    hostname === ROOT_DOMAIN ||
    hostname === `${ROOT_DOMAIN}:3000` ||
    hostname === "localhost:3000" ||
    hostname === "localhost" ||
    hostname.endsWith(".vercel.app");

  // ─── Auth refresh ──────────────────────────────────────────────────────────
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
    process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            response.cookies.set(name, value, options as any)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // ─── Landing (dominio raíz) ────────────────────────────────────────────────
  if (isRootDomain) {
    // Rutas de auth siempre permitidas
    if (url.pathname.startsWith("/login") || url.pathname.startsWith("/signup")) {
      return response;
    }
    // Dashboard del coach en la raíz requiere auth
    if (url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/onboarding")) {
      if (!user) {
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }
    }
    return response;
  }

  // ─── Subdominio del coach ──────────────────────────────────────────────────
  if (subdomain && subdomain !== "www") {
    // Reescribe internamente: coachpepe.lvh.me/anything → app.lvh.me/coach/coachpepe/anything
    url.pathname = `/coach/${subdomain}${url.pathname}`;
    const rewrite = NextResponse.rewrite(url, { request });
    // Pasar el slug al header para que los Server Components lo lean
    rewrite.headers.set("x-coach-slug", subdomain);
    if (user) rewrite.headers.set("x-user-id", user.id);
    return rewrite;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
