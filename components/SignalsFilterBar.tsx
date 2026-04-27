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
  { value: "history", label: "Histórico" },
  { value: "all", label: "Todas" },
];

const selectClassName =
  "h-11 rounded-xl border border-white/10 bg-black px-3 text-sm font-medium text-zinc-200 outline-none ring-emerald-400/20 transition focus:border-emerald-400/50 focus:ring-4";

export default function SignalsFilterBar({
  assets,
  filters,
  resultCount,
}: SignalsFilterBarProps) {
  return (
    <section className="mb-8 rounded-2xl border border-white/10 bg-zinc-950/80 p-5 shadow-2xl shadow-black/30">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
            Filtros
          </p>
          <p className="mt-2 text-sm text-zinc-400">
            Mostrando {resultCount} señales filtradas
          </p>
        </div>
        <Link
          href="/signals"
          className="text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
        >
          Limpiar filtros
        </Link>
      </div>

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
          Señal
          <select
            name="type"
            defaultValue={filters.type}
            className={selectClassName}
          >
            <option value="">Todas</option>
            {signalTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <span className="normal-case tracking-normal text-zinc-600">
            LONG, SHORT o espera.
          </span>
        </label>

        <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
          Riesgo
          <select
            name="risk"
            defaultValue={filters.risk}
            className={selectClassName}
          >
            <option value="">Todos</option>
            {riskLevels.map((risk) => (
              <option key={risk.value} value={risk.value}>
                {risk.label}
              </option>
            ))}
          </select>
          <span className="normal-case tracking-normal text-zinc-600">
            Nivel técnico del setup.
          </span>
        </label>

        <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
          Score mínimo
          <select
            name="minScore"
            defaultValue={filters.minScore}
            className={selectClassName}
          >
            <option value="">Cualquiera</option>
            {minScores.map((score) => (
              <option key={score.value} value={score.value}>
                {score.label}
              </option>
            ))}
          </select>
          <span className="normal-case tracking-normal text-zinc-600">
            Confluencia mínima.
          </span>
        </label>

        <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
          Estado de señal
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
