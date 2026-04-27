import AppShell from "@/components/AppShell";
import SignalTable, { type SignalTableRow } from "@/components/SignalTable";
import SignalsFilterBar, {
  type SignalsFilters,
} from "@/components/SignalsFilterBar";
import SignalsGuide from "@/components/SignalsGuide";
import { getEnabledAssets } from "@/lib/config/assets";
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

type SignalsPageProps = {
  searchParams: Promise<{
    symbol?: string | string[];
    type?: string | string[];
    risk?: string | string[];
    minScore?: string | string[];
    status?: string | string[];
  }>;
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

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseFilters(
  searchParams: Awaited<SignalsPageProps["searchParams"]>,
): SignalsFilters {
  const type = firstParam(searchParams.type)?.toUpperCase() ?? "";
  const risk = firstParam(searchParams.risk)?.toUpperCase() ?? "";
  const minScore = firstParam(searchParams.minScore) ?? "";
  const status = firstParam(searchParams.status) ?? "active";

  return {
    symbol: firstParam(searchParams.symbol)?.toUpperCase() ?? "",
    type: ["LONG", "SHORT", "WAIT"].includes(type) ? type : "",
    risk: ["LOW", "MEDIUM", "HIGH"].includes(risk) ? risk : "",
    minScore: ["60", "70", "80"].includes(minScore) ? minScore : "",
    status:
      status === "history" || status === "all" || status === "active"
        ? status
        : "active",
  };
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

function isHistorySignal(signal: SignalRecord, now: Date) {
  return Boolean(signal.expires_at && new Date(signal.expires_at) <= now);
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

function matchesFilters(
  signal: SignalRecord,
  filters: SignalsFilters,
  now: Date,
) {
  if (filters.status === "active" && !isActiveSignal(signal, now)) {
    return false;
  }

  if (filters.status === "history" && !isHistorySignal(signal, now)) {
    return false;
  }

  if (filters.symbol && signal.symbol !== filters.symbol) {
    return false;
  }

  if (filters.type && signal.signal_type !== filters.type) {
    return false;
  }

  if (filters.risk && signal.risk !== filters.risk) {
    return false;
  }

  if (filters.minScore) {
    const minScore = Number(filters.minScore);

    if (typeof signal.score !== "number" || signal.score < minScore) {
      return false;
    }
  }

  return true;
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

function EmptyFilteredSignals() {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-10 text-center shadow-2xl shadow-black/30">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
        Sin resultados
      </p>
      <h2 className="mt-4 text-3xl font-bold tracking-tight">
        No hay señales que coincidan con los filtros.
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-400">
        Prueba con otro activo, baja el score mínimo o cambia el estado para
        revisar el histórico completo.
      </p>
    </div>
  );
}

function getSectionTitle(status: SignalsFilters["status"]) {
  if (status === "history") {
    return "Histórico filtrado";
  }

  if (status === "all") {
    return "Señales filtradas";
  }

  return "Señales activas filtradas";
}

function getSectionDescription(status: SignalsFilters["status"]) {
  if (status === "history") {
    return "Señales caducadas que coinciden con los filtros aplicados.";
  }

  if (status === "all") {
    return "Todas las señales disponibles que coinciden con los filtros aplicados.";
  }

  return "Última lectura vigente por activo, ordenada por score descendente.";
}

export default async function SignalsPage({ searchParams }: SignalsPageProps) {
  const filters = parseFilters(await searchParams);
  const assets = getEnabledAssets();
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
  const filteredRecords = records.filter((signal) =>
    matchesFilters(signal, filters, now),
  );
  const filteredSignals =
    filters.status === "active"
      ? getCurrentSignalsBySymbol(filteredRecords).map((signal) =>
          mapSignal(signal),
        )
      : filteredRecords.map((signal) => mapSignal(signal));

  return (
    <AppShell
      eyebrow="SEÑALES"
      title="Señales de mercado para detectar oportunidades sin ruido."
      description="Consulta tus señales más recientes, priorizadas por vigencia, score y contexto operativo."
    >
      <SignalsGuide />

      <SignalsFilterBar
        assets={assets}
        filters={filters}
        resultCount={filteredSignals.length}
      />

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
      ) : filteredSignals.length > 0 ? (
        <SignalSection
          title={getSectionTitle(filters.status)}
          description={getSectionDescription(filters.status)}
          signals={filteredSignals}
        />
      ) : (
        <EmptyFilteredSignals />
      )}
    </AppShell>
  );
}
