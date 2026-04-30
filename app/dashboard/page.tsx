import AppShell from "@/components/AppShell";
import LogoutButton from "@/components/LogoutButton";
import MetricCard from "@/components/MetricCard";
import RiskBadge from "@/components/RiskBadge";
import ScoreBadge from "@/components/ScoreBadge";
import SignalBadge from "@/components/SignalBadge";
import TrendBadge from "@/components/TrendBadge";
import { isAdminEmail } from "@/lib/auth/admin";
import { getUserPlan } from "@/lib/plans/server";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

type SignalRecord = {
  id: string;
  symbol: string | null;
  base_asset: string | null;
  quote_asset: string | null;
  signal_type: string | null;
  score: number | null;
  risk: string | null;
  timeframe: string | null;
  price: number | null;
  reason: string | null;
  rsi: number | null;
  sma20: number | null;
  volume_ratio: number | null;
  trend: string | null;
  source: string | null;
  expires_at: string | null;
  created_at: string | null;
};

type WatchlistRow = {
  symbol: string;
};

type NotificationRecord = {
  id: string;
  symbol: string | null;
  title: string | null;
  body: string | null;
  read_at: string | null;
  created_at: string | null;
};

const quickLinks = [
  { href: "/signals?status=active", label: "Ver señales activas" },
  { href: "/signals?status=active&watchlist=true", label: "Mi watchlist" },
  { href: "/signals?status=active&minScore=70", label: "Score 70+" },
  { href: "/signals?status=active&risk=HIGH", label: "Riesgo alto" },
  { href: "/signals?status=active&type=LONG", label: "Solo LONG" },
  { href: "/signals?status=active&type=WAIT", label: "Solo WAIT" },
];

function formatPair(signal: SignalRecord) {
  if (signal.symbol) {
    return signal.symbol;
  }

  if (signal.base_asset && signal.quote_asset) {
    return `${signal.base_asset}/${signal.quote_asset}`;
  }

  return "Sin par";
}

function formatDate(value: string | null) {
  if (!value) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(new Date(value))
    .replace(",", " ·");
}

function formatPrice(value: number | null) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "-";
  }

  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value > 1000 ? 0 : 4,
  }).format(value);
}

function formatIndicator(value: number | null, digits = 1) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "-";
  }

  return value.toFixed(digits);
}

function countBySignalType(signals: SignalRecord[], signalType: string) {
  return signals.filter((signal) => signal.signal_type === signalType).length;
}

function countByRisk(signals: SignalRecord[], risk: string) {
  return signals.filter((signal) => signal.risk === risk).length;
}

function calculateAverageScore(signals: SignalRecord[]) {
  const scores = signals
    .map((signal) => signal.score)
    .filter((score): score is number => typeof score === "number");

  if (scores.length === 0) {
    return 0;
  }

  return Math.round(
    scores.reduce((total, score) => total + score, 0) / scores.length,
  );
}

function isActiveSignal(signal: SignalRecord, now: Date) {
  if (!signal.expires_at) {
    return true;
  }

  return new Date(signal.expires_at) > now;
}

function sortByScoreDesc(signals: SignalRecord[]) {
  return [...signals].sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
}

function WatchlistPanel({ symbols }: { symbols: string[] }) {
  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/30">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
            Mi watchlist
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">
            Activos que sigues de cerca
          </h2>
        </div>
        <Link
          href="/watchlist"
          className="text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
        >
          Configurar lista
        </Link>
      </div>

      {symbols.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-3">
          {symbols.map((symbol) => (
            <span
              key={symbol}
              className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 font-mono text-sm font-semibold text-emerald-200"
            >
              {symbol}
            </span>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-white/10 bg-black/40 p-5">
          <p className="text-sm leading-6 text-zinc-400">
            Todavía no has elegido activos. Configura tu watchlist para tener
            tus mercados favoritos siempre a mano.
          </p>
        </div>
      )}
    </section>
  );
}

function WatchlistSignalsPanel({
  signals,
  hasWatchlist,
}: {
  signals: SignalRecord[];
  hasWatchlist: boolean;
}) {
  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/30">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
            Señales de mi watchlist
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">
            Mejores lecturas activas de tus activos
          </h2>
        </div>
        <Link
          href={
            hasWatchlist
              ? "/signals?status=active&watchlist=true"
              : "/watchlist"
          }
          className="text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
        >
          {hasWatchlist ? "Ver filtro completo" : "Configurar watchlist"}
        </Link>
      </div>

      {!hasWatchlist ? (
        <div className="mt-5 rounded-xl border border-white/10 bg-black/40 p-5">
          <p className="text-sm leading-6 text-zinc-400">
            Añade activos a tu watchlist para que el panel priorice tus mercados
            favoritos y muestre aquí sus mejores señales activas.
          </p>
        </div>
      ) : signals.length > 0 ? (
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {signals.slice(0, 5).map((signal) => (
            <article
              key={signal.id}
              className="rounded-xl border border-white/10 bg-black/40 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                    Activo
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-white">
                    {formatPair(signal)}
                  </h3>
                </div>
                <ScoreBadge score={signal.score} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <SignalBadge signal={signal.signal_type} />
                <RiskBadge risk={signal.risk} />
                <TrendBadge trend={signal.trend} />
              </div>
              <p className="mt-4 font-mono text-xs text-zinc-500">
                {formatDate(signal.created_at)}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-white/10 bg-black/40 p-5">
          <p className="text-sm leading-6 text-zinc-400">
            Tu watchlist no tiene señales activas ahora mismo. Puedes revisar el
            histórico o ampliar los activos vigilados.
          </p>
        </div>
      )}
    </section>
  );
}

function RecentAlertsPanel({
  notifications,
}: {
  notifications: NotificationRecord[];
}) {
  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/30">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
            Alertas recientes
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">
            Últimas notificaciones internas
          </h2>
        </div>
        <Link
          href="/alerts"
          className="text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
        >
          Ver alertas
        </Link>
      </div>

      {notifications.length > 0 ? (
        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {notifications.map((notification) => (
            <article
              key={notification.id}
              className={`rounded-xl border p-4 ${
                notification.read_at
                  ? "border-white/10 bg-black/40"
                  : "border-emerald-400/30 bg-emerald-400/[0.08]"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-xs font-semibold text-zinc-300">
                  {notification.symbol ?? "Mercado"}
                </span>
                <span className="text-xs font-semibold text-zinc-500">
                  {notification.read_at ? "Leída" : "Nueva"}
                </span>
              </div>
              <h3 className="mt-3 text-base font-bold text-white">
                {notification.title ?? "Alerta de mercado"}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-400">
                {notification.body ?? "Nueva lectura interna disponible."}
              </p>
              <p className="mt-3 font-mono text-xs text-zinc-500">
                {formatDate(notification.created_at)}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-white/10 bg-black/40 p-5">
          <p className="text-sm leading-6 text-zinc-400">
            Aún no tienes alertas internas. Configura tus preferencias para
            recibir avisos cuando una señal encaje con tus criterios.
          </p>
        </div>
      )}
    </section>
  );
}

function SignalSummaryCard({ signal }: { signal: SignalRecord }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-zinc-950/80 p-5 shadow-2xl shadow-black/30">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
            {formatDate(signal.created_at)}
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-white">
            {formatPair(signal)}
          </h3>
        </div>
        <ScoreBadge score={signal.score} />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <SignalBadge signal={signal.signal_type} />
        <RiskBadge risk={signal.risk} />
        <TrendBadge trend={signal.trend} />
      </div>

      <div className="mt-5 grid gap-3 text-sm text-zinc-300 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-black/40 p-3">
          <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
            Precio
          </p>
          <p className="mt-1 font-semibold text-white">
            {formatPrice(signal.price)}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/40 p-3">
          <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
            RSI
          </p>
          <p className="mt-1 font-semibold text-white">
            {formatIndicator(signal.rsi)}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/40 p-3">
          <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
            Volumen
          </p>
          <p className="mt-1 font-semibold text-white">
            {formatIndicator(signal.volume_ratio, 2)}x
          </p>
        </div>
      </div>

      {signal.reason ? (
        <p className="mt-5 text-sm leading-6 text-zinc-400">{signal.reason}</p>
      ) : null}
    </article>
  );
}

function EmptyActiveState({ isAdmin }: { isAdmin: boolean }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-8 text-center shadow-2xl shadow-black/30">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
        Sin señales activas
      </p>
      <h2 className="mt-4 text-3xl font-bold tracking-tight">
        No hay lecturas vigentes ahora mismo.
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-400">
        Puedes revisar el histórico completo o lanzar una nueva generación si
        tienes permisos de administrador.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/signals?status=all"
          className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400 hover:text-black"
        >
          Revisar señales
        </Link>
        {isAdmin ? (
          <Link
            href="/admin/signals"
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-emerald-400/40 hover:text-emerald-200"
          >
            Generar señales
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [signalsResult, watchlistResult, notificationsResult, userPlan] = await Promise.all([
    supabase
      .from("signals")
      .select(
        "id, symbol, base_asset, quote_asset, signal_type, score, risk, timeframe, price, reason, rsi, sma20, volume_ratio, trend, source, expires_at, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("user_watchlist")
      .select("symbol")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("user_notifications")
      .select("id, symbol, title, body, read_at, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3),
    getUserPlan(user.id),
  ]);

  const now = new Date();
  const records = (signalsResult.data ?? []) as SignalRecord[];
  const watchlistSymbols = ((watchlistResult.data ?? []) as WatchlistRow[]).map(
    (row) => row.symbol,
  );
  const recentNotifications =
    (notificationsResult.data ?? []) as NotificationRecord[];
  const watchedSymbolSet = new Set(watchlistSymbols);
  const activeSignals = records.filter((signal) => isActiveSignal(signal, now));
  const sortedActiveSignals = sortByScoreDesc(activeSignals);
  const watchlistActiveSignals = sortByScoreDesc(
    activeSignals.filter((signal) =>
      Boolean(signal.symbol && watchedSymbolSet.has(signal.symbol)),
    ),
  );
  const hasWatchlist = watchlistSymbols.length > 0;
  const prioritySignals = hasWatchlist ? watchlistActiveSignals : activeSignals;
  const sortedPrioritySignals = sortByScoreDesc(prioritySignals);
  const featuredSignal = sortedPrioritySignals[0];
  const topWatchedSignals = sortedActiveSignals.slice(0, 5);
  const isAdmin = isAdminEmail(user.email);
  const plan = userPlan.plan;
  const averageScore = calculateAverageScore(prioritySignals);
  const longSignals = countBySignalType(prioritySignals, "LONG");
  const shortSignals = countBySignalType(prioritySignals, "SHORT");
  const waitSignals = countBySignalType(prioritySignals, "WAIT");
  const highRiskSignals = countByRisk(prioritySignals, "HIGH");
  const mediumRiskSignals = countByRisk(prioritySignals, "MEDIUM");
  const lowRiskSignals = countByRisk(prioritySignals, "LOW");
  const metricsScope = hasWatchlist
    ? "en activos de tu watchlist"
    : "en todo el mercado";
  const metrics = [
    {
      label: "Señales activas",
      value: String(prioritySignals.length),
      detail: `Lecturas vigentes ${metricsScope}`,
      accent: "emerald" as const,
    },
    {
      label: "Score medio",
      value: averageScore > 0 ? String(averageScore) : "-",
      detail: `Media de señales activas ${metricsScope}`,
      accent: "blue" as const,
    },
    {
      label: "LONG / SHORT / WAIT",
      value: `${longSignals} / ${shortSignals} / ${waitSignals}`,
      detail: "Distribución direccional activa",
      accent: "violet" as const,
    },
    {
      label: "Riesgo H / M / L",
      value: `${highRiskSignals} / ${mediumRiskSignals} / ${lowRiskSignals}`,
      detail: "Riesgo alto, medio y bajo",
      accent: "blue" as const,
    },
  ];

  return (
    <AppShell
      eyebrow="PANEL"
      title="Centro de mando para vigilar el mercado crypto."
      description="Resumen de señales activas, riesgo, score y accesos rápidos."
    >
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
            Usuario conectado
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <p className="text-sm text-zinc-300">{user.email}</p>
            <span className="rounded-full border border-emerald-400/35 bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-200">
              Plan {plan.badgeLabel}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/account"
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-emerald-400/40 hover:text-emerald-200"
          >
            Cuenta
          </Link>
          {isAdmin ? (
            <Link
              href="/admin/signals"
              className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400 hover:text-black"
            >
              Generar señales
            </Link>
          ) : null}
          <LogoutButton />
        </div>
      </div>

      {plan.id === "FREE" ? (
        <div className="mb-6 rounded-2xl border border-sky-400/20 bg-sky-400/[0.06] p-4 shadow-2xl shadow-black/20">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm leading-6 text-sky-100/85">
              Desbloquea mas activos y filtros avanzados con Pro.
            </p>
            <Link
              href="/pricing"
              className="text-sm font-semibold text-sky-200 transition hover:text-white"
            >
              Ver planes
            </Link>
          </div>
        </div>
      ) : null}

      <div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs text-amber-200/80">
        Las señales son lecturas técnicas informativas, no recomendaciones personalizadas.
      </div>

      {signalsResult.error ? (
        <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-6 text-red-100 shadow-2xl shadow-black/30">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-300">
            Error de lectura
          </p>
          <h2 className="mt-3 text-2xl font-bold">
            No se pudieron cargar las señales.
          </h2>
          <p className="mt-2 text-sm leading-6 text-red-100/80">
            Revisa permisos RLS o la disponibilidad de Supabase. No se muestran
            detalles sensibles.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} {...metric} />
            ))}
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <section>
              <div className="mb-4">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
                  Señal destacada
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight">
                  Mayor score activo ahora
                </h2>
              </div>
              {featuredSignal ? (
                <SignalSummaryCard signal={featuredSignal} />
              ) : (
                <EmptyActiveState isAdmin={isAdmin} />
              )}
            </section>

            <aside className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/30">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
                Accesos rápidos
              </p>
              <div className="mt-5 grid gap-3">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:border-emerald-400/40 hover:text-emerald-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </aside>
          </div>

          <WatchlistPanel symbols={watchlistSymbols} />

          <WatchlistSignalsPanel
            signals={watchlistActiveSignals}
            hasWatchlist={hasWatchlist}
          />

          <RecentAlertsPanel notifications={recentNotifications} />

          <section className="mt-8">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
                  Top activos vigilados
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight">
                  Las 5 señales activas de mayor score
                </h2>
              </div>
              <Link
                href="/signals?status=active"
                className="text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
              >
                Ver todas
              </Link>
            </div>

            {topWatchedSignals.length > 0 ? (
              <div className="grid gap-4 lg:grid-cols-5">
                {topWatchedSignals.map((signal) => (
                  <article
                    key={signal.id}
                    className="rounded-2xl border border-white/10 bg-zinc-950/80 p-5 shadow-2xl shadow-black/30"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                          Activo
                        </p>
                        <h3 className="mt-1 text-lg font-bold text-white">
                          {formatPair(signal)}
                        </h3>
                      </div>
                      <ScoreBadge score={signal.score} />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <SignalBadge signal={signal.signal_type} />
                      <RiskBadge risk={signal.risk} />
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3 text-xs text-zinc-500">
                      <TrendBadge trend={signal.trend} />
                      <span className="font-mono">
                        {formatDate(signal.created_at)}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyActiveState isAdmin={isAdmin} />
            )}
          </section>
        </>
      )}
    </AppShell>
  );
}
