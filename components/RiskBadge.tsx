type RiskBadgeProps = {
  risk: string | null | undefined;
};

function normalizeRisk(risk: string | null | undefined) {
  const normalized = risk?.toUpperCase() ?? "";

  if (normalized === "LOW" || normalized === "BAJO") {
    return "LOW";
  }

  if (normalized === "MEDIUM" || normalized === "MEDIO") {
    return "MEDIUM";
  }

  if (normalized === "HIGH" || normalized === "ALTO") {
    return "HIGH";
  }

  return "";
}

export default function RiskBadge({ risk }: RiskBadgeProps) {
  const normalized = normalizeRisk(risk);

  if (normalized === "HIGH") {
    return (
      <span className="inline-flex items-center rounded-full border border-red-400/45 bg-red-400/15 px-3 py-1 text-xs font-bold text-red-200 shadow-[0_0_18px_rgba(248,113,113,0.12)]">
        Alto riesgo
      </span>
    );
  }

  if (normalized === "MEDIUM") {
    return (
      <span className="inline-flex items-center rounded-full border border-amber-300/35 bg-amber-300/10 px-3 py-1 text-xs font-semibold text-amber-200">
        Riesgo medio
      </span>
    );
  }

  if (normalized === "LOW") {
    return (
      <span className="inline-flex items-center rounded-full border border-emerald-400/35 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
        Riesgo bajo
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-zinc-300">
      {risk ?? "Sin dato"}
    </span>
  );
}
