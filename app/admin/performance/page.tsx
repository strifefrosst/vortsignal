import Link from "next/link";
import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import PerformanceEvaluateButton from "@/components/PerformanceEvaluateButton";
import { getAdminSession } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatNumber(value: number | null | undefined) {
  return value === null || value === undefined ? "-" : value.toLocaleString("es-ES", { maximumFractionDigits: 2 });
}

function resultBadge(result: string) {
  const style = {
    WIN: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
    LOSS: "bg-red-400/15 text-red-300 border-red-400/30",
    FLAT: "bg-sky-400/15 text-sky-300 border-sky-400/30",
    OBSERVED: "bg-zinc-400/15 text-zinc-300 border-zinc-400/30",
  } as const;

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${style[result as keyof typeof style] ?? style.OBSERVED}`}>
      {result}
    </span>
  );
}

function AccessDenied({ email }: { email?: string }) {
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
        {email ? (
          <p className="mt-5 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-zinc-300">
            Sesión actual: {email}
          </p>
        ) : null}
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

export default async function AdminPerformancePage() {
  const { user, isAdmin } = await getAdminSession();

  if (!user) {
    redirect("/login");
  }

  if (!isAdmin) {
    return <AccessDenied email={user.email} />;
  }

  const adminClient = createAdminClient();

  const [{ count: totalCount }, { count: winCount }, { count: lossCount }, { count: flatCount }, { count: observedCount }, recentResponse] = await Promise.all([
    adminClient.from("signal_outcomes").select("id", { count: "exact", head: true }),
    adminClient.from("signal_outcomes").select("id", { count: "exact", head: true }).eq("result", "WIN"),
    adminClient.from("signal_outcomes").select("id", { count: "exact", head: true }).eq("result", "LOSS"),
    adminClient.from("signal_outcomes").select("id", { count: "exact", head: true }).eq("result", "FLAT"),
    adminClient.from("signal_outcomes").select("id", { count: "exact", head: true }).eq("result", "OBSERVED"),
    adminClient
      .from("signal_outcomes")
      .select("id, symbol, signal_type, score, result, entry_price, exit_price, pct_change, evaluated_at")
      .order("evaluated_at", { ascending: false })
      .limit(20),
  ]);

  const totalEvaluated = totalCount ?? 0;
  const totalWins = winCount ?? 0;
  const totalLosses = lossCount ?? 0;
  const totalFlat = flatCount ?? 0;
  const totalObserved = observedCount ?? 0;
  const nonObservedCount = totalWins + totalLosses + totalFlat;
  const winRate = nonObservedCount > 0 ? (totalWins / nonObservedCount) * 100 : null;

  const pctResponse = await adminClient
    .from("signal_outcomes")
    .select("pct_change");

  const pctRows = pctResponse.data ?? [];
  const averagePctChange = pctRows.length
    ? pctRows.reduce((sum, row) => sum + Number(row.pct_change ?? 0), 0) / pctRows.length
    : null;

  const recentOutcomes = recentResponse.data ?? [];

  return (
    <AppShell
      eyebrow="ADMIN"
      title="Rendimiento de señales"
      description="Este panel mide resultados posteriores de señales para auditar el motor. No representa garantía de resultados futuros."
    >
      <div className="mb-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-emerald-300 transition"
        >
          <span>←</span> Volver al panel admin
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_0.45fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/30">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
              Auditoría de rendimiento
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">
              Señales expiradas y resultados observados
            </h2>
            <p className="mt-4 text-sm leading-6 text-zinc-400">
              Este panel mide resultados posteriores de señales para auditar el motor. No representa garantía de resultados futuros.
            </p>
            <div className="mt-4 rounded-2xl bg-white/5 p-4 text-sm text-amber-200">
              La medición es experimental y depende del precio disponible al evaluar. No debe interpretarse como promesa de rentabilidad.
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Total evaluadas", value: totalEvaluated },
              { label: "Wins", value: totalWins },
              { label: "Losses", value: totalLosses },
              { label: "Flat", value: totalFlat },
              { label: "Observed", value: totalObserved },
              { label: "Win rate", value: winRate !== null ? `${winRate.toFixed(1)}%` : "N/A" },
              { label: "Pct change medio", value: averagePctChange !== null ? `${averagePctChange.toFixed(2)}%` : "N/A" },
            ].map((metric) => (
              <div key={metric.label} className="rounded-3xl border border-white/10 bg-zinc-950/80 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{metric.label}</p>
                <p className="mt-3 text-2xl font-semibold text-white">{metric.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/30">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Últimas evaluaciones</p>
                <h3 className="mt-2 text-xl font-semibold text-white">
                  Últimas 20 entradas en signal_outcomes
                </h3>
              </div>
              <PerformanceEvaluateButton />
            </div>

            <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-black/20">
              <div className="grid grid-cols-[1.1fr_0.9fr_0.9fr_0.8fr_0.9fr_0.9fr_0.9fr_1.1fr] gap-2 bg-zinc-950/90 px-4 py-3 text-xs uppercase tracking-[0.18em] text-zinc-500 sm:grid-cols-[1.2fr_1fr_0.9fr_0.9fr_0.9fr_0.9fr]">
                <span>Symbol</span>
                <span>Tipo</span>
                <span>Score</span>
                <span>Resultado</span>
                <span>Entrada</span>
                <span>Salida</span>
                <span>Pct%</span>
                <span>Evaluado</span>
              </div>
              <div className="space-y-2 px-2 py-3">
                {recentOutcomes.length === 0 ? (
                  <p className="px-4 py-8 text-center text-sm text-zinc-400">
                    No hay evaluaciones registradas.
                  </p>
                ) : (
                  recentOutcomes.map((row) => (
                    <div
                      key={row.id}
                      className="grid grid-cols-[1.1fr_0.9fr_0.9fr_0.8fr_0.9fr_0.9fr_0.9fr_1.1fr] gap-2 rounded-3xl border border-white/5 bg-zinc-950/90 px-4 py-3 text-sm text-zinc-200 sm:grid-cols-[1.2fr_1fr_0.9fr_0.9fr_0.9fr_0.9fr]"
                    >
                      <span>{row.symbol}</span>
                      <span>{row.signal_type}</span>
                      <span>{row.score ?? "-"}</span>
                      <span>{resultBadge(row.result)}</span>
                      <span>${formatNumber(row.entry_price)}</span>
                      <span>${formatNumber(row.exit_price)}</span>
                      <span>{row.pct_change !== null ? `${row.pct_change.toFixed(2)}%` : "-"}</span>
                      <span>{formatTimestamp(row.evaluated_at)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/30">
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-300">Acción</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Evaluar señales expiradas</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Inicia la revisión automática de señales expiradas con precio conocido. Solo se evaluarán señales sin outcomes previos para horizonte de 4 horas.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/30">
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Advertencia</p>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Estos resultados se basan en el precio disponible al momento de la evaluación. No deben interpretarse como promesa de rentabilidad ni como recomendación de trading.
            </p>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
