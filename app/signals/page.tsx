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
  rsi: number | null;
  sma20: number | null;
  volume_ratio: number | null;
  trend: string | null;
  source: string | null;
  expires_at: string | null;
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
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(new Date(value))
    .replace(",", " ·");
}

function mapSignal(signal: SignalRecord): SignalTableRow {
  return {
    id: signal.id,
    pair: formatPair(signal),
    signal: signal.signal_type ?? "Sin señal",
    score: signal.score,
    risk: signal.risk,
    timeframe: signal.timeframe,
    date: formatDate(signal.created_at),
    price: signal.price,
    reason: signal.reason,
    rsi: signal.rsi,
    volumeRatio: signal.volume_ratio,
    trend: signal.trend,
  };
}

function isActiveSignal(signal: SignalRecord, now: Date) {
  if (!signal.expires_at) {
    return true;
  }

  return new Date(signal.expires_at) > now;
}

function getSignalKey(signal: SignalRecord) {
  return signal.symbol ?? formatPair(signal);
}

function getSignalTime(signal: SignalRecord) {
  if (!signal.created_at) {
    return 0;
  }

  return new Date(signal.created_at).getTime();
}

function getCurrentSignalsBySymbol(signals: SignalRecord[]) {
  const currentSignals = new Map<string, SignalRecord>();

  signals.forEach((signal) => {
    const key = getSignalKey(signal);
    const current = currentSignals.get(key);

    if (!current || getSignalTime(signal) > getSignalTime(current)) {
      currentSignals.set(key, signal);
    }
  });

  return Array.from(currentSignals.values()).sort(
    (a, b) => (b.score ?? -1) - (a.score ?? -1),
  );
}

function SignalSection({
  title,
  description,
  signals,
}: {
  title: string;
  description: string;
  signals: SignalTableRow[];
}) {
  return (
    <section>
      <div className="mb-4 flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
          {title}
        </p>
        <p className="max-w-2xl text-sm leading-6 text-zinc-400">
          {description}
        </p>
      </div>
      <SignalTable signals={signals} />
    </section>
  );
}

function EmptyActiveSignals() {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-10 text-center shadow-2xl shadow-black/30">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
        Señales activas
      </p>
      <h2 className="mt-4 text-3xl font-bold tracking-tight">
        No hay señales vigentes ahora mismo.
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-400">
        Cuando el motor genere nuevas oportunidades aparecerán aquí hasta su
        vencimiento operativo.
      </p>
    </div>
  );
}

function EmptyRecentHistory() {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-8 text-center shadow-2xl shadow-black/30">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
        Histórico reciente
      </p>
      <h2 className="mt-4 text-2xl font-bold tracking-tight">
        Aún no hay señales cerradas para revisar.
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-400">
        Cuando una señal llegue a su vencimiento, aparecerá aquí con su contexto
        para facilitar el seguimiento.
      </p>
    </div>
  );
}

export default async function SignalsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("signals")
    .select(
      "id, symbol, base_asset, quote_asset, signal_type, score, risk, timeframe, price, reason, rsi, sma20, volume_ratio, trend, source, expires_at, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  const now = new Date();
  const records = (data ?? []) as SignalRecord[];
  const activeRecords = records.filter((signal) => isActiveSignal(signal, now));
  const activeSignals = getCurrentSignalsBySymbol(activeRecords).map((signal) =>
    mapSignal(signal),
  );
  const expiredSignals = records
    .filter((signal) => signal.expires_at && new Date(signal.expires_at) <= now)
    .map((signal) => mapSignal(signal));

  return (
    <AppShell
      eyebrow="SEÑALES"
      title="Señales de mercado para detectar oportunidades sin ruido."
      description="Consulta tus señales más recientes, priorizadas por vigencia, score y contexto operativo."
    >
      <div className="mb-5 flex flex-wrap gap-3" aria-label="Etiquetas de referencia">
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
            No se pudieron cargar las señales.
          </h2>
          <p className="mt-2 text-sm leading-6 text-red-100/80">
            Revisa permisos RLS o la disponibilidad de Supabase. La app sigue
            funcionando sin mostrar claves ni detalles sensibles.
          </p>
        </div>
      ) : records.length > 0 ? (
        <div className="grid gap-10">
          {activeSignals.length > 0 ? (
            <SignalSection
              title="Señales activas"
              description="La señal actual representa la última lectura vigente del motor para cada activo, ordenada por score descendente."
              signals={activeSignals}
            />
          ) : (
            <EmptyActiveSignals />
          )}

          {expiredSignals.length > 0 ? (
            <SignalSection
              title="Histórico reciente"
              description="Señales caducadas recientemente, conservadas para revisar contexto y trazabilidad."
              signals={expiredSignals}
            />
          ) : (
            <EmptyRecentHistory />
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-10 text-center shadow-2xl shadow-black/30">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
            Sin señales
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight">
            Todavía no hay oportunidades registradas.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-400">
            Cuando haya señales disponibles, aparecerán aquí ordenadas desde la
            más reciente.
          </p>
        </div>
      )}
    </AppShell>
  );
}
