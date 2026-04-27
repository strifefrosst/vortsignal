import SignalCard from "./SignalCard";

const signals = [
  ["BTC/USDC", "82", "Sesgo alcista", "Riesgo medio"],
  ["ETH/USDC", "74", "Esperar ruptura", "Riesgo medio"],
  ["SOL/USDC", "61", "Momentum débil", "Riesgo alto"],
] as const;

export default function DashboardPreview() {
  return (
    <div
      id="dashboard"
      className="mt-20 grid gap-4 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:grid-cols-3"
    >
      {signals.map(([pair, score, signal, risk]) => (
        <SignalCard
          key={pair}
          pair={pair}
          score={score}
          signal={signal}
          risk={risk}
        />
      ))}
    </div>
  );
}
