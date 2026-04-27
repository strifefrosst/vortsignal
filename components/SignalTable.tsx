import RiskBadge from "@/components/RiskBadge";
import ScoreBadge from "@/components/ScoreBadge";
import SignalBadge from "@/components/SignalBadge";
import TrendBadge from "@/components/TrendBadge";

export type SignalTableRow = {
  id?: string;
  pair: string;
  signal: string;
  score: number | null;
  risk: string | null;
  timeframe: string | null;
  date: string;
  price?: number | null;
  reason?: string | null;
  rsi?: number | null;
  volumeRatio?: number | null;
  trend?: string | null;
};

type SignalTableProps = {
  signals: SignalTableRow[];
};

function formatIndicator(value: number | null | undefined, digits = 1) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "-";
  }

  return value.toFixed(digits);
}

function Indicators({ signal }: { signal: SignalTableRow }) {
  return (
    <div className="grid gap-2 text-xs">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 font-semibold text-sky-200">
          RSI {formatIndicator(signal.rsi)}
        </span>
        <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 font-semibold text-violet-200">
          Vol {formatIndicator(signal.volumeRatio, 2)}x
        </span>
      </div>
      <TrendBadge trend={signal.trend} />
    </div>
  );
}

export default function SignalTable({ signals }: SignalTableProps) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 lg:hidden">
        {signals.map((signal) => (
          <article
            key={signal.id ?? `${signal.pair}-${signal.timeframe}-${signal.date}`}
            className="rounded-2xl border border-white/10 bg-zinc-950/80 p-5 shadow-2xl shadow-black/30"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Par
                </p>
                <h3 className="mt-1 text-xl font-bold text-white">
                  {signal.pair}
                </h3>
              </div>
              <ScoreBadge score={signal.score} />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <SignalBadge signal={signal.signal} />
              <RiskBadge risk={signal.risk} />
            </div>

            {signal.reason ? (
              <p className="mt-4 text-sm leading-6 text-zinc-400">
                {signal.reason}
              </p>
            ) : null}

            <div className="mt-5 rounded-xl border border-white/10 bg-black/40 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                Indicadores
              </p>
              <Indicators signal={signal} />
            </div>

            <div className="mt-4 flex items-center justify-between gap-4 text-xs text-zinc-500">
              <span>{signal.timeframe ?? "-"}</span>
              <span className="font-mono">{signal.date}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/80 shadow-2xl shadow-black/30 lg:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-[0.18em] text-zinc-500">
            <tr>
              <th className="px-5 py-4 font-semibold">Par</th>
              <th className="px-5 py-4 font-semibold">Señal</th>
              <th className="px-5 py-4 font-semibold">Score</th>
              <th className="px-5 py-4 font-semibold">Indicadores</th>
              <th className="px-5 py-4 font-semibold">Riesgo</th>
              <th className="px-5 py-4 font-semibold">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {signals.map((signal) => (
              <tr
                key={signal.id ?? `${signal.pair}-${signal.timeframe}-${signal.date}`}
                className="text-zinc-300"
              >
                <td className="px-5 py-4 font-semibold text-white">
                  {signal.pair}
                </td>
                <td className="px-5 py-4">
                  <SignalBadge signal={signal.signal} />
                  {signal.reason ? (
                    <div className="mt-1 max-w-sm truncate text-xs text-zinc-500">
                      {signal.reason}
                    </div>
                  ) : null}
                </td>
                <td className="px-5 py-4">
                  <ScoreBadge score={signal.score} />
                </td>
                <td className="px-5 py-4">
                  <Indicators signal={signal} />
                </td>
                <td className="px-5 py-4">
                  <RiskBadge risk={signal.risk} />
                </td>
                <td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-zinc-500">
                  {signal.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
