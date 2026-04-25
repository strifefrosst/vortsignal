import AppShell from "@/components/AppShell";
import SignalTable, { type SignalTableRow } from "@/components/SignalTable";
import { createClient } from "@/lib/supabase/server";

type SignalRecord = {
  id: string;
  symbol: string | null;
  base_asset: string | null;
  quote_asset: string | null;
  signal_type: string | null;
  score: number | null;
  risk: string | null;
  timeframe: string | null;
  price: number | null;
  reason: string | null;
  created_at: string | null;
};

function formatPair(signal: SignalRecord) {
  if (signal.symbol) {
    return signal.symbol;
  }

  if (signal.base_asset && signal.quote_asset) {
    return `${signal.base_asset}/${signal.quote_asset}`;
  }

  return "Sin par";
}

function formatDate(value: string | null) {
  if (!value) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function mapSignal(signal: SignalRecord): SignalTableRow {
  return {
    id: signal.id,
    pair: formatPair(signal),
    signal: signal.signal_type ?? "Sin senal",
    score: signal.score,
    risk: signal.risk,
    timeframe: signal.timeframe,
    date: formatDate(signal.created_at),
    price: signal.price,
    reason: signal.reason,
  };
}

export default async function SignalsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("signals")
    .select(
      "id, symbol, base_asset, quote_asset, signal_type, score, risk, timeframe, price, reason, created_at",
    )
    .order("created_at", { ascending: false });

  const signals = (data ?? []).map((signal) => mapSignal(signal));

  return (
    <AppShell
      eyebrow="Signals"
      title="Senales reales desde Supabase para explorar oportunidades sin ruido."
      description="Lectura server-side de public.signals, ordenada por fecha de creacion descendente."
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

      {error ? (
        <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-6 text-red-100 shadow-2xl shadow-black/30">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-300">
            Error de lectura
          </p>
          <h2 className="mt-3 text-2xl font-bold">
            No se pudieron cargar las senales.
          </h2>
          <p className="mt-2 text-sm leading-6 text-red-100/80">
            Revisa permisos RLS o la disponibilidad de Supabase. La app sigue
            funcionando sin mostrar claves ni detalles sensibles.
          </p>
        </div>
      ) : signals.length > 0 ? (
        <SignalTable signals={signals} />
      ) : (
        <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-10 text-center shadow-2xl shadow-black/30">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
            Sin senales
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight">
            Todavia no hay oportunidades registradas.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-400">
            Cuando existan filas en public.signals apareceran aqui ordenadas
            desde la mas reciente.
          </p>
        </div>
      )}
    </AppShell>
  );
}
