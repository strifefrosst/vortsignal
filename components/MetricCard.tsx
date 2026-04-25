type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  accent?: "emerald" | "blue" | "violet";
};

const accentClasses = {
  emerald: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/30",
  blue: "bg-sky-400/10 text-sky-300 ring-sky-400/30",
  violet: "bg-violet-400/10 text-violet-300 ring-violet-400/30",
};

export default function MetricCard({
  label,
  value,
  detail,
  accent = "emerald",
}: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-5 shadow-2xl shadow-black/30">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-zinc-400">{label}</p>
        <span
          className={`h-2.5 w-2.5 rounded-full ring-4 ${accentClasses[accent]}`}
        />
      </div>
      <p className="mt-5 text-3xl font-bold tracking-tight text-white">
        {value}
      </p>
      <p className="mt-2 text-sm text-zinc-500">{detail}</p>
    </div>
  );
}
