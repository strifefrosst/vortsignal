import StatusPill from "./StatusPill";

type StatusCardProps = {
  title: string;
  status?: "healthy" | "warning" | "error" | "neutral";
  children: React.ReactNode;
  lastUpdated?: string;
};

export default function StatusCard({
  title,
  status,
  children,
  lastUpdated,
}: StatusCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/30">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {status && <StatusPill status={status} />}
      </div>
      <div className="mt-4">{children}</div>
      {lastUpdated && (
        <p className="mt-4 text-xs text-zinc-500">
          Actualizado: {lastUpdated}
        </p>
      )}
    </div>
  );
}