type SignalBadgeProps = {
  signal: string | null | undefined;
};

function normalizeSignal(signal: string | null | undefined) {
  return signal?.toUpperCase() ?? "";
}

export default function SignalBadge({ signal }: SignalBadgeProps) {
  const normalized = normalizeSignal(signal);

  if (normalized === "LONG") {
    return (
      <span className="inline-flex items-center rounded-full border border-emerald-400/40 bg-emerald-400/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-emerald-200 shadow-[0_0_18px_rgba(52,211,153,0.12)]">
        LONG
      </span>
    );
  }

  if (normalized === "SHORT") {
    return (
      <span className="inline-flex items-center rounded-full border border-rose-400/40 bg-rose-400/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-rose-200 shadow-[0_0_18px_rgba(251,113,133,0.12)]">
        SHORT
      </span>
    );
  }

  if (normalized === "WAIT") {
    return (
      <span className="inline-flex items-center rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-amber-200">
        WAIT
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-zinc-300">
      {signal ?? "Sin señal"}
    </span>
  );
}
