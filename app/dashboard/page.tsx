import AppShell from "@/components/AppShell";
import MetricCard from "@/components/MetricCard";
import SignalTable from "@/components/SignalTable";
import { dashboardMetrics, mockSignals } from "@/lib/mockSignals";

export default function DashboardPage() {
  return (
    <AppShell
      eyebrow="Dashboard"
      title="Centro de mando para vigilar el mercado crypto."
      description="Vista mock de actividad, score y riesgo para validar la experiencia antes de conectar datos reales."
    >
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
