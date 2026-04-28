import Link from "next/link";
import type { SupportedAsset } from "@/lib/config/assets";

export type SignalsFilters = {
  symbol: string;
  type: string;
  risk: string;
  minScore: string;
  status: "active" | "history" | "all";
  watchlist: boolean;
};

type SignalsFilterBarProps = {
  assets: SupportedAsset[];
  filters: SignalsFilters;
  resultCount: number;
  advancedFiltersEnabled: boolean;
};

const signalTypes = [
  { value: "LONG", label: "LONG" },
  { value: "SHORT", label: "SHORT" },
  { value: "WAIT", label: "WAIT" },
];

const riskLevels = [
  { value: "LOW", label: "Riesgo bajo" },
  { value: "MEDIUM", label: "Riesgo medio" },
  { value: "HIGH", label: "Riesgo alto" },
];

const minScores = [
  { value: "60", label: "Score 60+" },
  { value: "70", label: "Score 70+" },
  { value: "80", label: "Score 80+" },
];

const statuses = [
  { value: "active", label: "Activas" },
  { value: "history", label: "Historico" },
  { value: "all", label: "Todas" },
];

const selectClassName =
  "h-11 rounded-xl border border-white/10 bg-black px-3 text-sm font-medium text-zinc-200 outline-none ring-emerald-400/20 transition focus:border-emerald-400/50 focus:ring-4 disabled:cursor-not-allowed disabled:text-zinc-600";

export default function SignalsFilterBar({
  assets,
  filters,
  resultCount,
  advancedFiltersEnabled,
}: SignalsFilterBarProps) {
  return (
    <section className="mb-8 rounded-2xl border border-white/10 bg-zinc-950/80 p-5 shadow-2xl shadow-black/30">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
            Filtros
          </p>
          <p className="mt-2 text-sm text-zinc-400">
            Mostrando {resultCount} senales filtradas
          </p>
        </div>
        <Link
          href={advancedFiltersEnabled ? "/signals" : "/pricing"}
          className="text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
        >
          {advancedFiltersEnabled ? "Limpiar filtros" : "Desbloquear Pro"}
        </Link>
      </div>

      {!advancedFiltersEnabled ? (
        <div className="mb-4 rounded-xl border border-sky-400/20 bg-sky-400/[0.06] px-4 py-3 text-sm text-sky-100/85">
          Tu plan Free mantiene activos los filtros basicos. Pro desbloquea
          tipo de senal, riesgo y score minimo.
        </div>
      ) : null}

      <form action="/signals" method="get" className="grid gap-3 md:grid-cols-6">
        <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 md:col-span-2">
          Activo
          <select
            name="symbol"
            defaultValue={filters.symbol}
            className={selectClassName}
          >
            <option value="">Todos</option>
            {assets.map((asset) => (
              <option key={asset.symbol} value={asset.symbol}>
                {asset.baseAsset}/{asset.quoteAsset} - {asset.name}
              </option>
            ))}
          </select>
          <span className="normal-case tracking-normal text-zinc-600">
            Filtra por un mercado concreto.
          </span>
        </label>

        <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
          Senal
          <select
            name="type"
            defaultValue={filters.type}
            className={selectClassName}
            disabled={!advancedFiltersEnabled}
          >
            <option value="">Todas</option>
            {signalTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <span className="normal-case tracking-normal text-zinc-600">
            {advancedFiltersEnabled ? "LONG, SHORT o espera." : "Disponible en Pro."}
          </span>
        </label>

        <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
          Riesgo
          <select
            name="risk"
            defaultValue={filters.risk}
            className={selectClassName}
            disabled={!advancedFiltersEnabled}
          >
            <option value="">Todos</option>
            {riskLevels.map((risk) => (
              <option key={risk.value} value={risk.value}>
                {risk.label}
              </option>
            ))}
          </select>
          <span className="normal-case tracking-normal text-zinc-600">
            {advancedFiltersEnabled ? "Nivel tecnico del setup." : "Disponible en Pro."}
          </span>
        </label>

        <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
          Score minimo
          <select
            name="minScore"
            defaultValue={filters.minScore}
            className={selectClassName}
            disabled={!advancedFiltersEnabled}
          >
            <option value="">Cualquiera</option>
            {minScores.map((score) => (
              <option key={score.value} value={score.value}>
                {score.label}
              </option>
            ))}
          </select>
          <span className="normal-case tracking-normal text-zinc-600">
            {advancedFiltersEnabled ? "Confluencia minima." : "Disponible en Pro."}
          </span>
        </label>

        <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
          Estado de senal
          <select
            name="status"
            defaultValue={filters.status}
            className={selectClassName}
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          <span className="normal-case tracking-normal text-zinc-600">
            Activas por defecto.
          </span>
        </label>

        <label className="flex min-h-11 items-center gap-3 rounded-xl border border-white/10 bg-black px-3 py-2 text-sm font-semibold text-zinc-200 md:col-span-2">
          <input
            type="checkbox"
            name="watchlist"
            value="true"
            defaultChecked={filters.watchlist}
            className="h-4 w-4 rounded border-white/20 bg-zinc-950 accent-emerald-400"
          />
          <span>
            Solo mi watchlist
            <span className="mt-1 block text-xs font-normal text-zinc-600">
              Muestra solo activos que has marcado para vigilar.
            </span>
          </span>
        </label>

        <button
          type="submit"
          className="min-h-11 rounded-xl bg-emerald-400 px-4 text-sm font-bold text-black transition hover:bg-emerald-300 md:col-start-6"
        >
          Aplicar filtros
        </button>
      </form>
    </section>
  );
}
