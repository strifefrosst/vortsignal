import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import { createClient } from "@/lib/supabase/server";

type SignupPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { error } = await searchParams;

  async function signUp(formData: FormData) {
    "use server";

    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    if (!email.trim()) {
      redirect("/signup?error=El%20email%20es%20obligatorio");
    }

    if (!password) {
      redirect("/signup?error=La%20contrase%C3%B1a%20es%20obligatoria");
    }

    if (password.length < 8) {
      redirect(
        "/signup?error=La%20contrase%C3%B1a%20debe%20tener%20al%20menos%208%20caracteres",
      );
    }

    const headerStore = await headers();
    const origin = headerStore.get("origin") ?? "http://localhost:3000";
    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      redirect(`/signup?error=${encodeURIComponent(error.message)}`);
    }

    redirect(
      "/login?message=Cuenta%20creada%20correctamente.%20Ya%20puedes%20iniciar%20sesi%C3%B3n.",
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <SiteHeader />
      <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-10 px-6 py-12 lg:grid-cols-[1fr_420px]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
            Beta privada
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight md:text-6xl">
            Crea tu acceso a VortSignal.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-zinc-400">
            Registro real con Supabase Auth para acceder al panel privado de
            señales y mercado.
          </p>
        </div>

        <form
          action={signUp}
          className="rounded-2xl border border-white/10 bg-zinc-950/90 p-6 shadow-2xl shadow-black/40"
        >
          <h2 className="text-2xl font-bold">Crear cuenta</h2>
          <p className="mt-2 text-sm text-zinc-500">
            Usa email y contraseña para entrar a la beta.
          </p>

          {error ? (
            <div className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <label className="mt-6 block text-sm font-medium text-zinc-300">
            Email
            <input
              name="email"
              type="email"
              required
              aria-describedby="signup-email-help"
              placeholder="trader@vortsignal.io"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none ring-emerald-400/30 placeholder:text-zinc-600 invalid:border-red-400/50 invalid:text-red-100 focus:ring-4"
            />
            <span id="signup-email-help" className="mt-2 block text-xs text-zinc-500">
              Obligatorio. Usa un email válido para confirmar tu acceso.
            </span>
          </label>

          <label className="mt-4 block text-sm font-medium text-zinc-300">
            Contraseña
            <input
              name="password"
              type="password"
              required
              minLength={8}
              aria-describedby="signup-password-help"
              placeholder="********"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none ring-emerald-400/30 placeholder:text-zinc-600 invalid:border-red-400/50 invalid:text-red-100 focus:ring-4"
            />
            <span
              id="signup-password-help"
              className="mt-2 block text-xs text-zinc-500"
            >
              Obligatorio. Mínimo 8 caracteres.
            </span>
          </label>

          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-emerald-400 px-4 py-3 font-bold text-black transition hover:bg-emerald-300"
          >
            Crear acceso
          </button>

          <p className="mt-5 text-center text-sm text-zinc-500">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-emerald-300">
              Iniciar sesión
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
