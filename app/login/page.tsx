import Link from "next/link";
import { redirect } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import { createClient } from "@/lib/supabase/server";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, message } = await searchParams;

  async function signIn(formData: FormData) {
    "use server";

    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      redirect("/login?error=No%20se%20pudo%20iniciar%20sesi%C3%B3n");
    }

    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <SiteHeader />
      <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-10 px-6 py-12 lg:grid-cols-[1fr_420px]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
            Acceso privado
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight md:text-6xl">
            Entra al panel privado de VortSignal.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-zinc-400">
            Acceso real con Supabase Auth para usuarios registrados. El panel
            muestra las señales disponibles y el contexto de mercado.
          </p>
        </div>

        <form
          action={signIn}
          className="rounded-2xl border border-white/10 bg-zinc-950/90 p-6 shadow-2xl shadow-black/40"
        >
          <h2 className="text-2xl font-bold">Iniciar sesión</h2>
          <p className="mt-2 text-sm text-zinc-500">
            Usa tu email y contraseña.
          </p>

          {message ? (
            <div className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
              {message}
            </div>
          ) : null}

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
              placeholder="trader@vortsignal.io"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none ring-emerald-400/30 placeholder:text-zinc-600 focus:ring-4"
            />
          </label>

          <label className="mt-4 block text-sm font-medium text-zinc-300">
            Contraseña
            <input
              name="password"
              type="password"
              required
              placeholder="********"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none ring-emerald-400/30 placeholder:text-zinc-600 focus:ring-4"
            />
          </label>

          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-emerald-400 px-4 py-3 font-bold text-black transition hover:bg-emerald-300"
          >
            Entrar al panel
          </button>

          <p className="mt-5 text-center text-sm text-zinc-500">
            ¿Sin cuenta todavía?{" "}
            <Link href="/signup" className="text-emerald-300">
              Crear cuenta
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
