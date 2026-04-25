import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <SiteHeader />
      <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-10 px-6 py-12 lg:grid-cols-[1fr_420px]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
            Acceso privado
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight md:text-6xl">
            Entra al panel cuando el backend este listo.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-zinc-400">
            Formulario visual sin autenticacion real. La integracion de usuarios
            se anadira mas adelante.
          </p>
        </div>

        <form className="rounded-2xl border border-white/10 bg-zinc-950/90 p-6 shadow-2xl shadow-black/40">
          <h2 className="text-2xl font-bold">Iniciar sesion</h2>
          <p className="mt-2 text-sm text-zinc-500">Demo visual de login.</p>

          <label className="mt-6 block text-sm font-medium text-zinc-300">
            Email
            <input
              type="email"
              placeholder="trader@vortsignal.io"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none ring-emerald-400/30 placeholder:text-zinc-600 focus:ring-4"
            />
          </label>

          <label className="mt-4 block text-sm font-medium text-zinc-300">
            Password
            <input
              type="password"
              placeholder="••••••••"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none ring-emerald-400/30 placeholder:text-zinc-600 focus:ring-4"
            />
          </label>

          <button
            type="button"
            className="mt-6 w-full rounded-xl bg-emerald-400 px-4 py-3 font-bold text-black transition hover:bg-emerald-300"
          >
            Entrar al dashboard
          </button>

          <p className="mt-5 text-center text-sm text-zinc-500">
            Sin cuenta todavia?{" "}
            <Link href="/pricing" className="text-emerald-300">
              Ver planes
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
