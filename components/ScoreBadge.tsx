type ScoreBadgeProps = {
  score: number | null | undefined;
};

export default function ScoreBadge({ score }: ScoreBadgeProps) {
  if (typeof score !== "number" || !Number.isFinite(score)) {
    return (
      <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-zinc-400">
        -
      </span>
    );
  }

  if (score >= 80) {
    return (
      <span className="inline-flex items-center rounded-full border border-emerald-300/50 bg-emerald-300/20 px-3 py-1 text-xs font-black text-emerald-100 shadow-[0_0_22px_rgba(52,211,153,0.18)]">
        {score}
      </span>
    );
  }

  if (score >= 60) {
    return (
      <span className="inline-flex items-center rounded-full border border-sky-300/35 bg-sky-300/12 px-3 py-1 text-xs font-bold text-sky-200">
        {score}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-zinc-300">
      {score}
    </span>
  );
}
