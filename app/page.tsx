export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-20">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
            VortSignal
          </p>

          <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
            Señales inteligentes, no humo.
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-zinc-400">
            Radar crypto para detectar oportunidades, filtrar ruido y analizar
            setups con score, riesgo y contexto técnico.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#dashboard"
              className="rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-black hover:bg-emerald-300"
            >
              Ver dashboard
            </a>

            <a
              href="#pricing"
              className="rounded-xl border border-zinc-700 px-6 py-3 font-semibold text-white hover:bg-zinc-900"
            >
              Unirme a la beta
            </a>
          </div>
        </div>

        <div
          id="dashboard"
          className="mt-20 grid gap-4 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:grid-cols-3"
        >
          {[
            ["BTC/USDC", "82", "Long moderado", "Riesgo medio"],
            ["ETH/USDC", "74", "Esperar ruptura", "Riesgo medio"],
            ["SOL/USDC", "61", "Momentum débil", "Riesgo alto"],
          ].map(([pair, score, signal, risk]) => (
            <div
              key={pair}
              className="rounded-2xl border border-zinc-800 bg-black p-5"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{pair}</h2>
                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm text-emerald-400">
                  Score {score}
                </span>
              </div>

              <p className="mt-6 text-2xl font-semibold">{signal}</p>
              <p className="mt-2 text-sm text-zinc-500">{risk}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}