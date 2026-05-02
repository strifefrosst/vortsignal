type StatusPillProps = {
  status: "healthy" | "warning" | "error" | "neutral";
  label?: string;
};

const statusStyles = {
  healthy: "bg-emerald-400/20 text-emerald-300 border-emerald-400/30",
  warning: "bg-amber-400/20 text-amber-300 border-amber-400/30",
  error: "bg-red-400/20 text-red-300 border-red-400/30",
  neutral: "bg-zinc-400/20 text-zinc-300 border-zinc-400/30",
};

const statusLabels = {
  healthy: "OK",
  warning: "Advertencia",
  error: "Error",
  neutral: "No disponible",
};

export default function StatusPill({ status, label }: StatusPillProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusStyles[status]}`}
    >
      {statusLabels[status]}
      {label && <span className="ml-1 text-zinc-400">— {label}</span>}
    </span>
  );
}