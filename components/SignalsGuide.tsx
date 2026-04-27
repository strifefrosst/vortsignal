const guideItems = [
  {
    label: "Score",
    description:
      "Nivel de confluencia técnica de 0 a 100. No es una probabilidad de beneficio.",
  },
  {
    label: "Señal",
    description:
      "LONG, SHORT o WAIT según la lectura técnica del activo en ese momento.",
  },
  {
    label: "Riesgo",
    description:
      "Nivel técnico del setup según volatilidad, RSI, volumen y claridad de la estructura.",
  },
  {
    label: "RSI",
    description:
      "Indicador de sobrecompra o sobreventa que ayuda a detectar extensión del movimiento.",
  },
  {
    label: "Volumen relativo",
    description:
      "Compara el volumen actual contra la media reciente para medir confirmación.",
  },
  {
    label: "Tendencia",
    description:
      "Lectura del precio frente a medias y estructura reciente del mercado.",
  },
];

export default function SignalsGuide() {
  return (
    <section className="mb-8 rounded-2xl border border-white/10 bg-zinc-950/80 p-5 shadow-2xl shadow-black/30">
      <div className="mb-5 flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
          Guía rápida
        </p>
        <h2 className="text-xl font-bold tracking-tight text-white">
          Cómo leer las señales
        </h2>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {guideItems.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-white/10 bg-black/40 p-4"
          >
            <p className="text-sm font-semibold text-white">{item.label}</p>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
