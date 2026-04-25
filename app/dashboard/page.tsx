import AppShell from "@/components/AppShell";
import LogoutButton from "@/components/LogoutButton";
import MetricCard from "@/components/MetricCard";
import SignalTable from "@/components/SignalTable";
import { dashboardMetrics, mockSignals } from "@/lib/mockSignals";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AppShell
      eyebrow="Dashboard"
      title="Centro de mando para vigilar el mercado crypto."
      description="Vista mock de actividad, score y riesgo para validar la experiencia antes de conectar datos reales."
    >
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
            Usuario conectado
          </p>
          <p className="mt-1 text-sm text-zinc-300">{user.email}</p>
        </div>
        <LogoutButton />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
        <SignalTable signals={mockSignals.slice(0, 4)} />

        <aside className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/30">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
            Pulso del mercado
          </p>
          <h2 className="mt-4 text-2xl font-bold">Sesgo selectivo</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            El entorno simulado mantiene fuerza en activos grandes y cautela en
            alts con menor liquidez. Sin ejecucion automatica ni datos reales.
          </p>
          <div className="mt-6 rounded-xl border border-sky-400/20 bg-sky-400/10 p-4 text-sm text-sky-200">
            Proxima fase: conectar fuentes de mercado y reglas de scoring.
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
