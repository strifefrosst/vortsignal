import AppShell from "@/components/AppShell";
import PageHelp from "@/components/PageHelp";
import { getEnabledAssets } from "@/lib/config/assets";
import { formatWatchlistLimit } from "@/lib/plans/config";
import { getUserPlan } from "@/lib/plans/server";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

type WatchlistRow = {
  symbol: string;
};

export default async function WatchlistPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const assets = getEnabledAssets();
  const { data, error } = await supabase
    .from("user_watchlist")
    .select("symbol")
    .eq("user_id", user.id);
  const watchedSymbols = new Set(
    ((data ?? []) as WatchlistRow[]).map((row) => row.symbol),
  );
  const userPlan = await getUserPlan(user.id);
  const plan = userPlan.plan;
  const watchedCount = watchedSymbols.size;
  const hasReachedLimit =
    plan.watchlistLimit !== null && watchedCount >= plan.watchlistLimit;

  return (
    <AppShell
      eyebrow="WATCHLIST"
      title="Elige los activos que quieres vigilar."
      description="Personaliza tu lista para tener a mano los mercados que mas sigues."
    >
      <div className="mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-5 shadow-2xl shadow-black/30">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
              Plan {plan.badgeLabel}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              {watchedCount} / {formatWatchlistLimit(plan.watchlistLimit)}
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Limite actual de watchlist segun tu plan.
            </p>
          </div>
          {hasReachedLimit ? (
            <Link
              href="/pricing"
              className="rounded-xl border border-sky-400/40 bg-sky-400/10 px-4 py-3 text-sm font-semibold text-sky-200 transition hover:bg-sky-400 hover:text-black"
            >
              Subir a Pro
            </Link>
          ) : null}
        </div>
        {hasReachedLimit ? (
          <p className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
            Has alcanzado el limite de tu plan. Quita un activo o sube a Pro
            para vigilar mas mercados.
          </p>
        ) : null}
      </div>

      <PageHelp
        title="¿Por qué vigilar activos?"
        description="Tu watchlist afecta al dashboard, a las alertas y a los filtros de señales. Usa esto para enfocarte en los mercados que realmente te interesan."
        items={[
          { label: "Dashboard", description: "Prioriza señales de tu lista" },
          { label: "Alertas", description: "Solo notifica si están en watchlist" },
          { label: "Señales", description: "Puedes filtrar por watchlist=true" },
          { label: "Límites por plan", description: "Free=3, Pro=10, Elite=25" },
        ]}
        variant="compact"
      />

      {error ? (
        <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-6 text-red-100 shadow-2xl shadow-black/30">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-300">
            Error de lectura
          </p>
          <h2 className="mt-3 text-2xl font-bold">
            No se pudo cargar tu watchlist.
          </h2>
          <p className="mt-2 text-sm leading-6 text-red-100/80">
            Revisa permisos RLS o disponibilidad de Supabase. No se muestran
            detalles sensibles.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {assets.map((asset) => {
            const isWatching = watchedSymbols.has(asset.symbol);
            const isAddBlocked = !isWatching && hasReachedLimit;

            return (
              <article
                key={asset.symbol}
                className={`rounded-2xl border p-5 shadow-2xl shadow-black/30 ${
                  isWatching
                    ? "border-emerald-400/30 bg-emerald-400/[0.08]"
                    : "border-white/10 bg-zinc-950/80"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                      {asset.baseAsset}/{asset.quoteAsset}
                    </p>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
                      {asset.name}
                    </h2>
                    <p className="mt-2 font-mono text-sm text-zinc-500">
                      {asset.symbol}
                    </p>
                  </div>
                  {isWatching ? (
                    <span className="rounded-full border border-emerald-400/35 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                      Vigilando
                    </span>
                  ) : null}
                </div>

                <form action="/api/watchlist/toggle" method="post" className="mt-6">
                  <input type="hidden" name="symbol" value={asset.symbol} />
                  <button
                    type="submit"
                    disabled={isAddBlocked}
                    className={`w-full rounded-xl px-4 py-3 text-sm font-bold transition ${
                      isAddBlocked
                        ? "cursor-not-allowed border border-amber-400/20 bg-amber-400/10 text-amber-100"
                        : isWatching
                          ? "border border-white/10 bg-white/[0.04] text-zinc-200 hover:border-red-400/40 hover:text-red-200"
                          : "bg-emerald-400 text-black hover:bg-emerald-300"
                    }`}
                  >
                    {isWatching
                      ? "Quitar"
                      : isAddBlocked
                        ? "Limite alcanzado"
                        : "Anadir"}
                  </button>
                </form>
              </article>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
