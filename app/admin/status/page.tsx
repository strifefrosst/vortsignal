import { redirect } from "next/navigation";
import { isAdminEmail } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import StatusCard from "@/components/StatusCard";
import StatusPill from "@/components/StatusPill";

async function getStatus() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ""}/api/admin/status`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Error al obtener estado");
  }

  return res.json();
}

export default async function AdminStatusPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (!isAdminEmail(user.email)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-400/20">
            <span className="text-3xl">🚫</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Acceso denegado</h1>
          <p className="mt-4 text-sm text-zinc-400">
            Esta página es solo para administradores. Tu email no tiene acceso.
          </p>
          <a
            href="/dashboard"
            className="mt-8 inline-block rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-zinc-300 hover:bg-white/10"
          >
            Volver al dashboard
          </a>
        </div>
      </div>
    );
  }

  let statusData: any = null;
  let statusError: string | null = null;

  try {
    statusData = await getStatus();
  } catch (err) {
    statusError = err instanceof Error ? err.message : "Error desconocido";
  }

  const formatTimestamp = (iso: string) => {
    return new Date(iso).toLocaleString("es-ES", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getOverallStatus = () => {
    if (!statusData) return "error";
    const { summary } = statusData;
    if (summary.error > 0) return "error";
    if (summary.warning > 0) return "warning";
    return "healthy";
  };

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4">
          <a
            href="/admin"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-emerald-300 transition"
          >
            <span>←</span> Volver al panel admin
          </a>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
              ADMIN
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
              Estado interno de VortSignal
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Panel privado para revisar integraciones, datos recientes y señales de salud del sistema.
            </p>
          </div>
          <a
            href="/admin/status"
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-200 hover:bg-emerald-400/20"
          >
            <span>🔄</span>
            Actualizar estado
          </a>
        </div>

        {statusError && (
          <div className="mb-8 rounded-2xl border border-red-400/20 bg-red-400/10 p-6">
            <h2 className="text-lg font-semibold text-red-300">Error al cargar estado</h2>
            <p className="mt-2 text-sm text-red-100/80">{statusError}</p>
          </div>
        )}

        {statusData && (
          <>
            <div className="mb-8 rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
                    Estado general
                  </p>
                  <p className="mt-2 text-3xl font-black text-white">
                    {statusData.summary.healthy} OK / {statusData.summary.warning} Warn / {statusData.summary.error} Err
                  </p>
                </div>
                <StatusPill status={getOverallStatus()} />
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                Última actualización: {formatTimestamp(statusData.timestamp)}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Environment */}
              <StatusCard
                title="Entorno"
                status={statusData.environment.allConfigured ? "healthy" : "error"}
                lastUpdated={formatTimestamp(statusData.timestamp)}
              >
                <div className="space-y-2">
                  {statusData.environment.checks.map((check: any) => (
                    <div
                      key={check.key}
                      className="flex items-center justify-between rounded-lg border border-white/5 bg-black/30 px-3 py-2"
                    >
                      <span className="text-sm text-zinc-300">{check.label}</span>
                      <span
                        className={`text-xs font-semibold ${
                          check.configured ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {check.configured ? "✓ configurada" : "✗ falta"}
                      </span>
                    </div>
                  ))}
                </div>
              </StatusCard>

              {/* Database */}
              <StatusCard
                title="Base de datos"
                status={statusData.database.allAccessible ? "healthy" : "error"}
                lastUpdated={formatTimestamp(statusData.timestamp)}
              >
                <div className="space-y-2">
                  {statusData.database.checks.map((check: any) => (
                    <div
                      key={check.table}
                      className="flex items-center justify-between rounded-lg border border-white/5 bg-black/30 px-3 py-2"
                    >
                      <span className="text-sm text-zinc-300">{check.table}</span>
                      <div className="text-right">
                        <span
                          className={`text-xs font-semibold ${
                            check.accessible ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {check.accessible ? "✓ accesible" : "✗ error"}
                        </span>
                        {check.count !== undefined && (
                          <span className="ml-2 text-xs text-zinc-500">
                            ({check.count.toLocaleString()})
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </StatusCard>

              {/* Signals */}
              <StatusCard
                title="Señales"
                status={statusData.signals.status}
                lastUpdated={formatTimestamp(statusData.timestamp)}
              >
                <div className="space-y-3">
                  {statusData.signals.lastSignal && (
                    <div className="rounded-lg border border-white/5 bg-black/30 p-3">
                      <p className="text-xs text-zinc-500">Última señal</p>
                      <p className="mt-1 font-semibold text-white">
                        {statusData.signals.lastSignal.symbol} — {statusData.signals.lastSignal.signal_type}
                      </p>
                      <p className="text-xs text-zinc-400">
                        Score: {statusData.signals.lastSignal.score} | Source: {statusData.signals.lastSignal.source}
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-white/5 bg-black/30 p-3">
                      <p className="text-xs text-zinc-500">Últimas 48h (cron)</p>
                      <p className="mt-1 text-xl font-bold text-white">
                        {statusData.signals.recentCronCount}
                      </p>
                    </div>
                    <div className="rounded-lg border border-white/5 bg-black/30 p-3">
                      <p className="text-xs text-zinc-500">Últimas 48h (admin)</p>
                      <p className="mt-1 text-xl font-bold text-white">
                        {statusData.signals.recentAdminCount}
                      </p>
                    </div>
                  </div>
                </div>
              </StatusCard>

              {/* Binance */}
              <StatusCard
                title="Binance"
                status={statusData.binance.ok ? "healthy" : "error"}
                lastUpdated={formatTimestamp(statusData.timestamp)}
              >
                <div className="rounded-lg border border-white/5 bg-black/30 p-3">
                  {statusData.binance.ok ? (
                    <>
                      <p className="text-xs text-zinc-500">Precio BTC/USDT</p>
                      <p className="mt-1 text-2xl font-bold text-emerald-400">
                        ${statusData.binance.price?.toLocaleString()}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        Symbol: {statusData.binance.symbol}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-red-400">Error conectando a Binance</p>
                      <p className="mt-1 text-xs text-zinc-400">
                        {statusData.binance.error}
                      </p>
                    </>
                  )}
                </div>
              </StatusCard>

              {/* Stripe */}
              <StatusCard
                title="Stripe"
                status={statusData.stripe.stripeReachable ? "healthy" : statusData.stripe.proPriceConfigured && statusData.stripe.elitePriceConfigured ? "warning" : "error"}
                lastUpdated={formatTimestamp(statusData.timestamp)}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border border-white/5 bg-black/30 px-3 py-2">
                    <span className="text-sm text-zinc-300">Pro Price</span>
                    <span
                      className={`text-xs font-semibold ${
                        statusData.stripe.proPriceConfigured ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {statusData.stripe.proPriceConfigured ? "✓ configurado" : "✗ falta"}
                    </span>
                  </div>
                  {statusData.stripe.proPriceInfo && (
                    <p className="text-xs text-zinc-500 ml-2">
                      {statusData.stripe.proPriceInfo.currency} / {statusData.stripe.proPriceInfo.recurring}
                    </p>
                  )}
                  <div className="flex items-center justify-between rounded-lg border border-white/5 bg-black/30 px-3 py-2">
                    <span className="text-sm text-zinc-300">Elite Price</span>
                    <span
                      className={`text-xs font-semibold ${
                        statusData.stripe.elitePriceConfigured ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {statusData.stripe.elitePriceConfigured ? "✓ configurado" : "✗ falta"}
                    </span>
                  </div>
                  {statusData.stripe.elitePriceInfo && (
                    <p className="text-xs text-zinc-500 ml-2">
                      {statusData.stripe.elitePriceInfo.currency} / {statusData.stripe.elitePriceInfo.recurring}
                    </p>
                  )}
                  <div className="flex items-center justify-between rounded-lg border border-white/5 bg-black/30 px-3 py-2">
                    <span className="text-sm text-zinc-300">Stripe API</span>
                    <span
                      className={`text-xs font-semibold ${
                        statusData.stripe.stripeReachable ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {statusData.stripe.stripeReachable ? "✓ reachable" : "✗ unreachable"}
                    </span>
                  </div>
                  {statusData.stripe.error && (
                    <p className="text-xs text-red-400 ml-2">{statusData.stripe.error}</p>
                  )}
                </div>
              </StatusCard>
            </div>
          </>
        )}
      </div>
    </div>
  );
}