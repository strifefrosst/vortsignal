import Link from "next/link";
import AppShell from "@/components/AppShell";

interface RoadmapPhase {
  phase: number;
  title: string;
  status: "current" | "next" | "future";
  objective: string;
  features: string[];
  value: string;
}

const phases: RoadmapPhase[] = [
  {
    phase: 1,
    title: "Producto base",
    status: "current",
    objective: "SaaS crypto funcional con integraciones principales.",
    features: [
      "Señales crypto en tiempo real",
      "Dashboard personal",
      "Watchlist con límites por plan",
      "Alertas internas configurables",
      "Planes Free/Pro/Elite",
      "Stripe Checkout y Customer Portal",
      "Panel admin para supervisión",
      "Performance/backtesting inicial de señales",
    ],
    value: "Base sólida para trading educativo con acceso a señales técnicas confiables.",
  },
  {
    phase: 2,
    title: "Educación y usabilidad",
    status: "current",
    objective: "Explicaciones visibles en cada sección para que todos entienda el producto.",
    features: [
      "Leyendas visibles de score, riesgo, RSI, SMA20, volumen relativo, tendencia",
      "Explicación de LONG, SHORT, WAIT",
      "Tutorial rápido (5 minutos)",
      "Tutorial para principiantes (sin experiencia previa)",
      "Tutorial avanzado (con análisis técnico)",
      "Glosario completo de términos",
      "Modo onboarding guiado para nuevos usuarios",
    ],
    value: "Comunidad informada, toma de decisiones mejor fundamentada, reducción de fricciones.",
  },
  {
    phase: 3,
    title: "Backend avanzado de administración",
    status: "next",
    objective: "Infraestructura empresarial interna para escalar operaciones y equipo.",
    features: [
      "Gestión centralizada de usuarios",
      "Control de planes y suscripciones por usuario",
      "Auditoría detallada de cada señal generada",
      "Gestión avanzada de alertas y notificaciones",
      "Logs de sistema y auditoría",
      "Roles internos: admin, analyst, support, moderator",
      "Panel privado para equipo de soporte",
      "Panel privado para analistas humanos",
      "Revisión manual y feedback sobre señales",
      "Métricas de negocio: retención, conversión, uso, revenue",
      "Monitorización en tiempo real: Supabase, Stripe, Binance, cron, webhooks",
    ],
    value: "Escalabilidad operativa, detección de problemas, retroalimentación para mejorar el motor.",
  },
  {
    phase: 4,
    title: "Noticias de mercado",
    status: "future",
    objective: "Contexto informativo para entender mejor las señales.",
    features: [
      "Sección de noticias crypto",
      "Agregación mediante RSS y APIs públicas cuando sea posible",
      "Scraping ético solo si es legal, permitido por términos y técnicamente seguro",
      "Clasificación por activo, sector, impacto y sentimiento",
      "Resumen automático con IA",
      "Enlaces a fuente original y verificación",
      "Detección automática de noticias relevantes para tu watchlist",
      "Alertas por evento importante",
    ],
    value: "Contexto para entender por qué se generan señales, mejor análisis fundamental.",
  },
  {
    phase: 5,
    title: "Marketplace de bots y herramientas",
    status: "future",
    objective: "Ecosistema de herramientas y scripts para traders.",
    features: [
      "Mercado de bots para diferentes plataformas",
      "Bots y plantillas de estrategias para TradingView",
      "Scripts de análisis técnico personalizados",
      "Indicadores técnicos avanzados",
      "Marketplace de analistas y herramientas",
      "Sistema de valoraciones y reviews",
      "Control de calidad de herramientas publicadas",
      "Disclaimers claros de riesgo",
      "Separación entre herramientas educativas, señales y automatización",
    ],
    value: "Extensibilidad del ecosistema, ingresos pasivos para analistas, valor agregado.",
  },
  {
    phase: 6,
    title: "Portfolio y seguimiento de activos",
    status: "future",
    objective: "Gestión y análisis de cartera propia.",
    features: [
      "Portfolio manual con registro de posiciones",
      "Seguimiento automático de precio, peso y rentabilidad",
      "Distribución por sectores, activos, riesgo y divisa",
      "Historial completo de movimientos",
      "DCA (Dollar Cost Averaging) tracker",
      "Alertas por sobreexposición",
      "Alertas por concentración excesiva",
      "Simulador de escenarios de mercado",
    ],
    value: "Visibilidad completa de tu cartera, detección de riesgos, optimización de exposición.",
  },
  {
    phase: 7,
    title: "Importación y conexión de portfolios",
    status: "future",
    objective: "Conectar carteras reales con VortSignal sin riesgos.",
    features: [
      "Importación mediante captura/screenshot",
      "Importación CSV desde diferentes fuentes",
      "Importación manual posición por posición",
      "Conexiones oficiales con APIs cuando Revolut, Trade Republic u otras plataformas lo permitan",
      "Detección automática de posiciones, sectores, pesos y exposición",
      "Nunca guardar credenciales sensibles",
      "Prioridad en OAuth y APIs oficiales frente a scraping",
      "Modo lectura solo, nunca automatización de operaciones",
    ],
    value: "Visibilidad real de cartera sin riesgos de seguridad, análisis integrado.",
  },
  {
    phase: 8,
    title: "Asistente de cartera",
    status: "future",
    objective: "Análisis educativo inteligente de tu cartera.",
    features: [
      "Cuestionario inicial: experiencia, horizonte, tolerancia al riesgo, objetivo, capital, preferencias, liquidez, volatilidad aceptada",
      "Análisis: sectores débiles, sobreexposición, concentración, duplicados, riesgo por divisa, pesos por sector",
      "Sugerencias educativas: rebalanceos potenciales, simulaciones, escenarios, alertas de concentración, momentos para revisar DCA",
      "Avisos claros: no es asesoramiento financiero personalizado, requiere revisión legal para ofrecerlo",
    ],
    value: "Insights educativos personalizados para optimizar cartera, toma de decisiones informada.",
  },
  {
    phase: 9,
    title: "Escalado empresarial",
    status: "future",
    objective: "Infraestructura para empresa grande con múltiples equipos.",
    features: [
      "Equipo interno multinacional",
      "Soporte multiusuario avanzado",
      "Panel de operaciones en tiempo real",
      "Analistas humanos revisando señales",
      "Sistemas de aseguramiento de calidad",
      "Auditoría técnica avanzada",
      "Control de versiones de modelos de IA",
      "Métricas de retención, conversión, lifetime value y uso",
      "Integraciones externas con plataformas de trading",
    ],
    value: "Escalabilidad infinita, confiabilidad empresarial, múltiples servicios integrados.",
  },
];

function statusBadge(status: "current" | "next" | "future") {
  const styles = {
    current: "bg-emerald-400/20 text-emerald-300 border-emerald-400/40",
    next: "bg-sky-400/20 text-sky-300 border-sky-400/40",
    future: "bg-zinc-400/20 text-zinc-300 border-zinc-400/40",
  };

  const labels = {
    current: "En construcción",
    next: "Próximo",
    future: "Futuro",
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function PhaseCard({ phase }: { phase: RoadmapPhase }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/30">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-500">
            Fase {phase.phase}
          </p>
          <h3 className="mt-2 text-2xl font-bold text-white">{phase.title}</h3>
        </div>
        {statusBadge(phase.status)}
      </div>

      <p className="mt-4 text-sm leading-6 text-zinc-400">{phase.objective}</p>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">Incluye</p>
        <ul className="mt-3 space-y-2">
          {phase.features.map((feature) => (
            <li key={feature} className="text-sm text-zinc-300 flex items-start gap-3">
              <span className="text-emerald-400 font-bold">→</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 rounded-xl border border-white/5 bg-white/[0.02] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">Valor</p>
        <p className="mt-2 text-sm text-zinc-300">{phase.value}</p>
      </div>
    </article>
  );
}

export default function RoadmapPage() {
  return (
    <AppShell
      eyebrow="ROADMAP"
      title="Hoja de ruta de VortSignal"
      description="Evolución estratégica del producto por fases. Cada fase añade funcionalidades que escalan la plataforma y mejoran la experiencia del usuario."
    >
      <div className="mb-8 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-6">
        <p className="text-sm leading-6 text-amber-100">
          <strong>Aviso regulatorio:</strong> VortSignal no ofrece asesoramiento financiero personalizado. Las funciones de portfolio y asistentes se plantean como análisis educativo, simulación y seguimiento hasta revisión legal específica. No es una recomendación de inversión ni promesa de rentabilidad.
        </p>
      </div>

      <div className="mb-12">
        <p className="text-sm leading-6 text-zinc-400">
          VortSignal está diseñado para escalar en 9 fases. La Fase 1 es el producto base funcional que existe hoy. Cada fase subsiguiente añade complejidad, capacidad de equipo y valor agregado.
        </p>
      </div>

      <div className="space-y-6">
        {phases.map((phase) => (
          <PhaseCard key={phase.phase} phase={phase} />
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-white/10 bg-zinc-950/80 p-8 text-center shadow-2xl shadow-black/30">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">Empezar</p>
        <h2 className="mt-4 text-2xl font-bold text-white">¿Listo para explorar VortSignal?</h2>
        <p className="mt-3 text-sm text-zinc-400">
          Descubre cómo funcionan las señales y comienza tu análisis hoy.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/signals"
            className="rounded-xl bg-emerald-400 px-6 py-3 text-sm font-bold text-black transition hover:bg-emerald-300"
          >
            Ver señales
          </Link>
          <Link
            href="/learn"
            className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-6 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400/20"
          >
            Ir a Guía
          </Link>
          <Link
            href="/disclaimer"
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/10"
          >
            Disclaimer completo
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
