type TrendBadgeProps = {
  trend: string | null | undefined;
};

function normalizeTrend(trend: string | null | undefined) {
  const normalized = trend?.toLowerCase() ?? "";

  if (normalized === "alcista" || normalized === "bullish") {
    return "bullish";
  }

  if (normalized === "bajista" || normalized === "bearish") {
    return "bearish";
  }

  return "neutral";
}

export default function TrendBadge({ trend }: TrendBadgeProps) {
  const normalized = normalizeTrend(trend);

  if (normalized === "bullish") {
    return (
      <span className="inline-flex items-center rounded-full border border-emerald-400/35 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
        Alcista
      </span>
    );
  }

  if (normalized === "bearish") {
    return (
      <span className="inline-flex items-center rounded-full border border-rose-400/35 bg-rose-400/10 px-3 py-1 text-xs font-semibold text-rose-200">
        Bajista
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-zinc-300">
      Neutral
    </span>
  );
}
