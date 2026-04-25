export default function Hero() {
  return (
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
  );
}
