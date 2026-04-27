import AppShell from "@/components/AppShell";
import LogoutButton from "@/components/LogoutButton";
import MetricCard from "@/components/MetricCard";
import SignalTable, { type SignalTableRow } from "@/components/SignalTable";
import { isAdminEmail } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

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

function countBySignalType(signals: SignalRecord[], signalType: string) {
  return signals.filter((signal) => signal.signal_type === signalType).length;
}

function calculateAverageScore(signals: SignalRecord[]) {
  const scores = signals
    .map((signal) => signal.score)
    .filter((score): score is number => typeof score === "number");

  if (scores.length === 0) {
    return 0;
  }

  return Math.round(
    scores.reduce((total, score) => total + score, 0) / scores.length,
  );
}

function isActiveSignal(signal: SignalRecord, now: Date) {
  if (!signal.expires_at) {
    return true;
  }

  return new Date(signal.expires_at) > now;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("signals")
    .select(
      "id, symbol, base_asset, quote_asset, signal_type, score, risk, timeframe, price, reason, rsi, sma20, volume_ratio, trend, source, expires_at, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(25);

  const recentSignals = (data ?? []) as SignalRecord[];
  const activeSignals = recentSignals.filter((signal) =>
    isActiveSignal(signal, new Date()),
  );
  const metricSignals =
    activeSignals.length > 0 ? activeSignals : recentSignals;
  const latestSignals = metricSignals.slice(0, 5).map(mapSignal);
  const averageScore = calculateAverageScore(metricSignals);
  const totalSignals = metricSignals.length;
  const longSignals = countBySignalType(metricSignals, "LONG");
  const shortSignals = countBySignalType(metricSignals, "SHORT");
  const waitSignals = countBySignalType(metricSignals, "WAIT");
  const metricScope =
    activeSignals.length > 0 ? "señales activas" : "histórico reciente";
  const isAdmin = isAdminEmail(user.email);
  const metrics = [
    {
      label: activeSignals.length > 0 ? "Señales activas" : "Señales recientes",
      value: String(totalSignals),
      detail:
        activeSignals.length > 0
          ? "Vigentes por ventana operativa"
          : "Referencia con registros recientes",
      accent: "emerald" as const,
    },
    {
      label: "Score medio",
      value: averageScore > 0 ? String(averageScore) : "-",
      detail: `Media de ${metricScope} con score`,
      accent: "blue" as const,
    },
    {
      label: "LONG",
      value: String(longSignals),
      detail: "Sesgo alcista detectado",
      accent: "emerald" as const,
    },
    {
      label: "SHORT / WAIT",
      value: `${shortSignals} / ${waitSignals}`,
      detail: "Lecturas defensivas o de espera",
      accent: "violet" as const,
    },
  ];

  return (
    <AppShell
      eyebrow="PANEL"
      title="Centro de mando para vigilar el mercado crypto."
      description="Resumen de señales generadas, score medio y dirección operativa."
    >
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
            Usuario conectado
          </p>
          <p className="mt-1 text-sm text-zinc-300">{user.email}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {isAdmin ? (
            <Link
              href="/admin/signals"
              className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400 hover:text-black"
            >
              Generar señales
            </Link>
          ) : null}
          <LogoutButton />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
        <section>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
                Últimas señales
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">
                {activeSignals.length > 0
                  ? "Las 5 lecturas activas más recientes"
                  : "Histórico reciente como referencia"}
              </h2>
            </div>
            <Link
              href="/signals"
              className="text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
            >
              Ver todas
            </Link>
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-6 text-red-100 shadow-2xl shadow-black/30">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-300">
                Error de lectura
              </p>
              <h3 className="mt-3 text-2xl font-bold">
                No se pudieron cargar las señales.
              </h3>
              <p className="mt-2 text-sm leading-6 text-red-100/80">
                Revisa permisos RLS o la disponibilidad de Supabase. No se
                muestran detalles sensibles.
              </p>
            </div>
          ) : latestSignals.length > 0 ? (
            <SignalTable signals={latestSignals} />
          ) : (
            <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-8 text-center shadow-2xl shadow-black/30">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
                Sin señales
              </p>
              <h3 className="mt-4 text-2xl font-bold tracking-tight">
                Aún no hay registros recientes.
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-400">
                Cuando el motor genere señales, aparecerán aquí desde la más
                reciente.
              </p>
            </div>
          )}
        </section>

        <aside className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/30">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
            Pulso operativo
          </p>
          <h2 className="mt-4 text-2xl font-bold">Lectura de señales</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Este panel prioriza señales activas. Si no hay vigentes, usa el
            histórico reciente como referencia visual sin ejecutar llamadas
            nuevas a Binance desde el panel.
          </p>
          <div className="mt-6 grid gap-3 text-sm text-zinc-300">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              LONG: {longSignals} {metricScope}.
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              SHORT: {shortSignals} {metricScope}.
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              WAIT: {waitSignals} {metricScope}.
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
