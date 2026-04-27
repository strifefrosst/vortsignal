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

export default function SignalTable({ signals }: SignalTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/80 shadow-2xl shadow-black/30">
      <div className="overflow-x-auto">
        <table className="min-w-[980px] w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-[0.18em] text-zinc-500">
            <tr>
              <th className="px-5 py-4 font-semibold">Par</th>
              <th className="px-5 py-4 font-semibold">Señal</th>
              <th className="px-5 py-4 font-semibold">Score</th>
              <th className="px-5 py-4 font-semibold">RSI</th>
              <th className="px-5 py-4 font-semibold">Volumen</th>
              <th className="px-5 py-4 font-semibold">Tendencia</th>
              <th className="px-5 py-4 font-semibold">Riesgo</th>
              <th className="px-5 py-4 font-semibold">Marco</th>
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
                  <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold text-sky-200">
                    {formatIndicator(signal.rsi)}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-semibold text-violet-200">
                    {formatIndicator(signal.volumeRatio, 2)}x
                  </span>
                </td>
                <td className="px-5 py-4">
                  <TrendBadge trend={signal.trend} />
                </td>
                <td className="px-5 py-4">
                  <RiskBadge risk={signal.risk} />
                </td>
                <td className="px-5 py-4 text-zinc-400">
                  {signal.timeframe ?? "-"}
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
