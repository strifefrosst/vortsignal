import Link from "next/link";
import AppShell from "@/components/AppShell";

interface GlossaryItem {
  term: string;
  definition: string;
}

const glossary: GlossaryItem[] = [
  {
    term: "Score",
    definition: "Puntuación de 0-100 que mide la fuerza de la lectura técnica de una señal. No es probabilidad de acierto, sino confluencia de indicadores. Score 80+ indica convergencia fuerte.",
  },
  {
    term: "Riesgo",
    definition: "Clasificación LOW/MEDIUM/HIGH basada en distancia al stop loss calculado. No es volatilidad del activo, sino riesgo técnico de la posición específica.",
  },
  {
    term: "RSI",
    definition: "Relative Strength Index. Indicador de momento que va de 0-100. Valores <30 suelen indicar sobreventa, >70 sobrecompra. RSI 14 (períodos) es el más usado.",
  },
  {
    term: "SMA20",
    definition: "Media móvil simple de 20 velas. Indica la tendencia promedio de corto plazo. Precios por encima = tendencia alcista, por debajo = bajista.",
  },
  {
    term: "Volumen relativo",
    definition: "Comparación del volumen actual vs media histórica. Valores >1 indican volumen superior a normal, confirmando movimientos.",
  },
  {
    term: "Tendencia",
    definition: "Clasificación alcista (uptrend), bajista (downtrend) o lateral (sideways). Se calcula comparando precio actual con SMA20.",
  },
  {
    term: "Señal activa",
    definition: "Señal dentro de su horizonte de expiración (4 horas típicamente). Mantiene su validez para análisis en tiempo real.",
  },
  {
    term: "Histórico",
    definition: "Señal que ha expirado (pasadas sus 4 horas). Visible para análisis posterior pero no activa para trading.",
  },
  {
    term: "Watchlist",
    definition: "Tu lista personal de activos vigilados. Limita las alertas y el dashboard a solo esos mercados. Límites: Free=3, Pro=10, Elite=25.",
  },
  {
    term: "Alerta",
    definition: "Notificación interna que se dispara cuando una nueva señal cumple tus criterios (score mínimo, tipos, riesgo, watchlist).",
  },
  {
    term: "Backtesting",
    definition: "Análisis de cómo se habrían comportado las señales en el pasado. Performance muestra win rate, losses, flat y observed.",
  },
  {
    term: "Portfolio",
    definition: "Cartera de inversiones personal. Función futura para registrar y seguir tus posiciones reales.",
  },
];

export default function LearnPage() {
  return (
    <AppShell
      eyebrow="GUÍA"
      title="Guía de uso de VortSignal"
      description="Aprende cómo funcionan las señales, cómo interpretar los indicadores y cómo sacar el máximo valor de la plataforma."
    >
      <div className="mb-8 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-6">
        <p className="text-sm leading-6 text-amber-100">
          <strong>Aviso regulatorio:</strong> VortSignal no ofrece asesoramiento financiero personalizado. Las señales son análisis técnico educativo. No promete rentabilidad ni sustituye la revisión personal ni asesoramiento profesional.
        </p>
      </div>

      {/* Quick Start */}
      <section className="mb-12 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">⚡</span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">5 minutos</p>
            <h2 className="text-2xl font-bold text-white">Empieza ya</h2>
          </div>
        </div>

        <ol className="space-y-3 mt-6">
          {[
            "Revisa el Mercado para ver precios y tendencias actuales",
            "Añade activos a tu Watchlist (los que quieres seguir)",
            "Mira las Señales activas en tiempo real",
            "Configura Alertas para recibir notificaciones",
            "Accede al Dashboard para ver tu resumen personal",
            "Lee Disclaimer si tienes dudas regulatorias",
          ].map((step, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-zinc-300">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/20 text-xs font-bold text-emerald-300 flex-shrink-0">
                {idx + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>

        <div className="mt-6 flex gap-3">
          <Link
            href="/signals"
            className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-bold text-black transition hover:bg-emerald-300"
          >
            Ver señales
          </Link>
          <Link
            href="/market"
            className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400/20"
          >
            Ir a Mercado
          </Link>
        </div>
      </section>

      {/* Beginner Tutorial */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">📚</span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">Tutorial</p>
            <h2 className="text-2xl font-bold text-white">Para principiantes</h2>
          </div>
        </div>

        <div className="space-y-5">
          {[
            {
              title: "¿Qué es una señal?",
              content:
                "Una señal es un análisis técnico que dice: en este momento, este activo tiene características que históricamente han precedido a un movimiento. No promete resultado, es una lectura matemática de patrones.",
            },
            {
              title: "¿Qué es LONG?",
              content:
                "Una señal LONG dice: el precio probablemente subirá. Si tú tradesabas largo (comprar), esta es tu dirección. Si actualmente lo tienes, es una confirmación de tu posición.",
            },
            {
              title: "¿Qué es SHORT?",
              content:
                "Una señal SHORT dice: el precio probablemente bajará. Es útil si shortsabas o si quieres hedgearte. En crypto, shorting tiene riesgos adicionales según tu plataforma.",
            },
            {
              title: "¿Qué es WAIT?",
              content:
                "Una señal WAIT dice: todavía no hay confluencia clara. Espera. No es negativa, es prudente. Muchos traders respetan WAIT porque evita falsos positivos.",
            },
            {
              title: "¿Qué significa Score?",
              content:
                "El Score (0-100) mide cuántos indicadores técnicos convergen en la misma dirección. Score 80+ = convergencia fuerte, más fiable. Score 50-60 = débil, usa con cuidado.",
            },
            {
              title: "¿Qué significa Riesgo?",
              content:
                "El Riesgo (LOW/MEDIUM/HIGH) mide la distancia técnica al stop loss. LOW = menos riesgo técnico, HIGH = más. Es riesgo de la operación específica, no del activo en general.",
            },
            {
              title: "¿Qué es RSI?",
              content:
                "RSI (Relative Strength Index) mide el momentum de 0-100. RSI >70 = sobrecompra (probable reversal), RSI <30 = sobreventa (probable rebote). Es un indicador de extremo.",
            },
            {
              title: "¿Qué es SMA20?",
              content:
                "SMA20 es la media móvil simple de los últimos 20 períodos (velas 1h). Precio >SMA20 = tendencia alcista, <SMA20 = bajista. Es el filtro de tendencia.",
            },
            {
              title: "¿Qué es Volumen relativo?",
              content:
                "Volumen relativo compara el volumen actual vs la media de 20 velas. 1.5x = 50% más volumen que normal, confirmando movimientos. >1.0 es positivo para confianza.",
            },
            {
              title: "¿Qué es Tendencia?",
              content:
                "Tendencia (alcista/bajista/lateral) muestra la dirección dominante. Alcista = precios subiendo, bajista = bajando, lateral = rango sin dirección clara.",
            },
            {
              title: "¿Por qué una señal no garantiza resultado?",
              content:
                "Porque el mercado es probabilístico, no determinístico. Los indicadores son históricos: muestran patrones pasados que a veces se repiten, no siempre. Falsos positivos son normales.",
            },
            {
              title: "¿Por qué WAIT también es útil?",
              content:
                "Porque evita operar en momentos de incertidumbre. Un WAIT correcto es mejor que un LONG falso. El riesgo de no operar a veces es menor que el de operar mal.",
            },
          ].map((item, idx) => (
            <div key={idx} className="rounded-xl border border-white/10 bg-zinc-950/80 p-5">
              <h4 className="font-semibold text-white">{item.title}</h4>
              <p className="mt-2 text-sm leading-6 text-zinc-300">{item.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            href="/watchlist"
            className="rounded-xl bg-sky-400 px-4 py-2 text-sm font-bold text-black transition hover:bg-sky-300"
          >
            Crear mi watchlist
          </Link>
          <Link
            href="/signals"
            className="rounded-xl border border-sky-400/40 bg-sky-400/10 px-4 py-2 text-sm font-semibold text-sky-200 transition hover:bg-sky-400/20"
          >
            Ver ejemplos
          </Link>
        </div>
      </section>

      {/* Advanced Tutorial */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🎓</span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-300">Tutorial</p>
            <h2 className="text-2xl font-bold text-white">Para usuarios avanzados</h2>
          </div>
        </div>

        <div className="space-y-5">
          {[
            {
              title: "Confluencia técnica",
              content:
                "VortSignal genera score alto cuando RSI, SMA20, volumen y tendencia convergen. Es un filtro AND: solo señales donde múltiples indicadores coinciden se generan. Esto reduce ruido pero puede perder oportunidades.",
            },
            {
              title: "Score como fuerza, no probabilidad",
              content:
                "Score 85 NO significa 85% de probabilidad de ganar. Significa 85 de 100 en confluencia técnica. Puede perder igual. Úsalo como peso relativo de confianza, no como garantía.",
            },
            {
              title: "Señales activas vs histórico",
              content:
                "Activas = dentro de horizonte (4h típicamente). Histórico = expiradas. Para backtesting, analiza histórico. Para tradingear ahora, usa activas. Expiration evita operar señales obsoletas.",
            },
            {
              title: "Watchlist como filtro",
              content:
                "Tu watchlist afecta: dashboard (prioriza tus activos), alertas (notificaciones solo si están en lista), señales (puedes filtrar por watchlist=true). Es un filtro personal para ruido.",
            },
            {
              title: "Alertas como automación básica",
              content:
                "Las alertas internasno operan, solo notifican. Puedes configurarlas por score mínimo, tipos (LONG/SHORT/WAIT), riesgo y si es watchlist. Son un radar personal.",
            },
            {
              title: "Performance y backtesting",
              content:
                "Performance muestra cómo se comportaron señales expiradas. Win rate solo sobre LONG/SHORT (excluyendo WAIT/OBSERVED). Úsalo para validar el motor, no para predecir futuros.",
            },
            {
              title: "Falsos positivos y limitaciones",
              content:
                "Falsos positivos: señales que no resultaron. Son normales en cualquier sistema técnico. Si ves >50% de falsos positivos, el motor necesita ajuste. Revisa cómo interprets los indicadores.",
            },
            {
              title: "Limitaciones del motor",
              content:
                "El motor NO ve noticias, NO ajusta por sesiones (EE.UU/Asia/Europa), NO tiene machine learning adaptativo, NO predice gaps. Es análisis técnico puro de 1h. Limítaciones por diseño.",
            },
          ].map((item, idx) => (
            <div key={idx} className="rounded-xl border border-white/10 bg-zinc-950/80 p-5">
              <h4 className="font-semibold text-white">{item.title}</h4>
              <p className="mt-2 text-sm leading-6 text-zinc-300">{item.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            href="/alerts"
            className="rounded-xl bg-violet-400 px-4 py-2 text-sm font-bold text-black transition hover:bg-violet-300"
          >
            Configurar alertas
          </Link>
          <Link
            href="/admin/performance"
            className="rounded-xl border border-violet-400/40 bg-violet-400/10 px-4 py-2 text-sm font-semibold text-violet-200 transition hover:bg-violet-400/20"
          >
            Ver performance
          </Link>
        </div>
      </section>

      {/* Glossary */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">📖</span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Referencia</p>
            <h2 className="text-2xl font-bold text-white">Glosario</h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {glossary.map((item) => (
            <div key={item.term} className="rounded-xl border border-white/10 bg-zinc-950/80 p-5">
              <h4 className="font-semibold text-emerald-300">{item.term}</h4>
              <p className="mt-2 text-sm leading-5 text-zinc-300">{item.definition}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What VortSignal Does NOT Do */}
      <section className="mb-12 rounded-2xl border border-red-400/20 bg-red-400/10 p-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">⛔</span>
          <h2 className="text-2xl font-bold text-white">Qué NO hace VortSignal</h2>
        </div>

        <ul className="space-y-3 mt-5">
          {[
            "No promete rentabilidad ni ganancias garantizadas",
            "No sustituye asesoramiento financiero profesional",
            "No ejecuta operaciones automáticamente (solo notifica)",
            "No debe ser tu única fuente de decisión (siempre verifica)",
            "No es una licencia financiera, solo análisis técnico educativo",
            "No tiene algoritmos secretos (es confluencia de indicadores conocidos)",
            "No funciona en todos los mercados (crypto 1h principalmente)",
            "No evita pérdidas (solo intenta mejorar probabilidades teóricas)",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-red-100">
              <span className="text-red-300 font-bold">×</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* CTAs */}
      <section className="rounded-2xl border border-white/10 bg-zinc-950/80 p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">Siguiente paso</p>
        <h2 className="mt-4 text-2xl font-bold text-white">¿Listo para empezar?</h2>
        <p className="mt-3 text-sm text-zinc-400">
          Accede a las principales secciones de VortSignal.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/signals"
            className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-emerald-300"
          >
            Señales
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl bg-sky-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-sky-300"
          >
            Dashboard
          </Link>
          <Link
            href="/watchlist"
            className="rounded-xl bg-violet-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-violet-300"
          >
            Watchlist
          </Link>
          <Link
            href="/alerts"
            className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-amber-300"
          >
            Alertas
          </Link>
          <Link
            href="/disclaimer"
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/10"
          >
            Disclaimer
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
