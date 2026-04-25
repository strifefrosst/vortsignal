import AppShell from "@/components/AppShell";
import SignalTable from "@/components/SignalTable";
import { mockSignals } from "@/lib/mockSignals";

export default function SignalsPage() {
  return (
    <AppShell
      eyebrow="Signals"
      title="Senales mock para explorar oportunidades sin ruido."
      description="Tabla inicial con pares, direccion operativa, score, riesgo, timeframe y fecha de emision simulada."
    >
      <div className="mb-5 flex flex-wrap gap-3">
        {["Spot", "Futuros", "Score 70+", "Riesgo bajo/medio"].map((filter) => (
          <span
            key={filter}
            className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-300"
          >
            {filter}
          </span>
        ))}
      </div>
      <SignalTable signals={mockSignals} />
    </AppShell>
  );
}
