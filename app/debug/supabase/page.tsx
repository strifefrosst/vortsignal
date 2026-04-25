import { createClient } from "@/lib/supabase/server";

export default async function SupabaseDebugPage() {
  const supabase = await createClient();

  const checks = [
    {
      label: "NEXT_PUBLIC_SUPABASE_URL",
      status: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    },
    {
      label: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      status: Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
    },
    {
      label: "Server client",
      status: Boolean(supabase.auth),
    },
  ];

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <section className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/40">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
          Supabase debug
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
          Comprobacion segura del cliente server
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Esta pagina solo valida presencia de configuracion y creacion del
          cliente. No imprime claves ni conecta auth al login.
        </p>

        <div className="mt-8 space-y-3">
          {checks.map((check) => (
            <div
              key={check.label}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-black px-4 py-3"
            >
              <span className="text-sm text-zinc-300">{check.label}</span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  check.status
                    ? "bg-emerald-400/10 text-emerald-300"
                    : "bg-red-400/10 text-red-300"
                }`}
              >
                {check.status ? "OK" : "Falta"}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
