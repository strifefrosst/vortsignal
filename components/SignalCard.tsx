type SignalCardProps = {
  pair: string;
  score: string;
  signal: string;
  risk: string;
};

export default function SignalCard({
  pair,
  score,
  signal,
  risk,
}: SignalCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-black p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{pair}</h2>
        <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm text-emerald-400">
          Score {score}
        </span>
      </div>

      <p className="mt-6 text-2xl font-semibold">{signal}</p>
      <p className="mt-2 text-sm text-zinc-500">{risk}</p>
    </div>
  );
}
