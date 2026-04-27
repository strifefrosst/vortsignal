import type { RiskLevel } from "@/lib/mockSignals";

export type SignalTableRow = {
  id?: string;
  pair: string;
  signal: string;
  score: number | null;
  risk: RiskLevel | string | null;
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

const riskClasses: Record<RiskLevel, string> = {
  Bajo: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  Medio: "border-sky-400/30 bg-sky-400/10 text-sky-300",
  Alto: "border-violet-400/30 bg-violet-400/10 text-violet-300",
};

function getRiskClass(risk: SignalTableRow["risk"]) {
  if (risk === "Bajo" || risk === "Medio" || risk === "Alto") {
    return riskClasses[risk];
  }

  return "border-white/10 bg-white/[0.03] text-zinc-300";
}

function formatIndicator(value: number | null | undefined, digits = 1) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "-";
  }

  return value.toFixed(digits);
}

function formatTrend(trend: string | null | undefined) {
  if (!trend) {
    return "Sin dato";
  }

  return trend.charAt(0).toUpperCase() + trend.slice(1);
}

function getTrendClass(trend: string | null | undefined) {
  if (trend === "alcista" || trend === "bullish") {
    return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
  }

  if (trend === "bajista" || trend === "bearish") {
    return "border-red-400/30 bg-red-400/10 text-red-300";
  }

  return "border-white/10 bg-white/[0.03] text-zinc-300";
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
                  <div>{signal.signal}</div>
                  {signal.reason ? (
                    <div className="mt-1 max-w-sm truncate text-xs text-zinc-500">
                      {signal.reason}
                    </div>
                  ) : null}
                </td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-emerald-300">
                    {signal.score ?? "-"}
                  </span>
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
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${getTrendClass(signal.trend)}`}
                  >
                    {formatTrend(signal.trend)}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${getRiskClass(signal.risk)}`}
                  >
                    {signal.risk ?? "Sin dato"}
                  </span>
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
