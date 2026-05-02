"use client";

import { useState } from "react";

type PortfolioPosition = {
  id: number;
  symbol: string;
  asset_name: string | null;
  asset_type: string;
  quantity: number;
  average_price: number;
  currency: string;
  platform: string | null;
  notes: string | null;
  current_price?: number | null;
  estimated_current_value?: number | null;
};

type PortfolioPositionsListProps = {
  initialPositions: PortfolioPosition[];
  cryptoPrices?: Record<string, number>;
  onDeleted?: () => void;
};

export default function PortfolioPositionsList({
  initialPositions,
  cryptoPrices = {},
  onDeleted,
}: PortfolioPositionsListProps) {
  const [positions, setPositions] = useState<PortfolioPosition[]>(initialPositions);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(id: number) {
    setDeletingId(id);
    setError(null);

    try {
      const response = await fetch("/api/portfolio/positions", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "No se pudo eliminar la posición.");
      }

      setPositions((current) => current.filter((position) => position.id !== id));
      setDeletingId(null);
      if (onDeleted) {
        onDeleted();
      }
    } catch (error) {
      setDeletingId(null);
      setError(error instanceof Error ? error.message : "Error de eliminación.");
    }
  }

  return (
    <div className="space-y-4">
      {error ? (
        <div className="rounded-3xl border border-red-500/20 bg-red-950/60 p-4 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {positions.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-zinc-950/80 p-8 text-center text-sm text-zinc-300">
          No hay posiciones registradas todavía. Añade tu primera posición desde el formulario.
        </div>
      ) : (
        <div className="grid gap-4">
          {positions.map((position) => {
            const currentPrice = cryptoPrices?.[position.symbol.toUpperCase()] ?? null;
            const estimatedCurrentValue =
              currentPrice != null ? currentPrice * position.quantity : position.estimated_current_value ?? null;
            const investedValue = position.average_price * position.quantity;
            const diff =
              estimatedCurrentValue != null
                ? estimatedCurrentValue - investedValue
                : undefined;
            const diffPercent =
              estimatedCurrentValue != null && investedValue !== 0
                ? (diff! / investedValue) * 100
                : undefined;

            return (
              <div key={position.id} className="rounded-3xl border border-white/10 bg-zinc-950/80 p-5 shadow-xl shadow-black/20">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
                      {position.asset_type}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <p className="text-xl font-semibold text-white">{position.symbol}</p>
                      <p className="text-sm text-zinc-400">{position.asset_name ?? "Activo manual"}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(position.id)}
                    disabled={deletingId === position.id}
                    className="inline-flex items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingId === position.id ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">Invertido</p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {new Intl.NumberFormat("es-ES", {
                        style: "currency",
                        currency: position.currency || "USD",
                      }).format(investedValue)}
                    </p>
                    <p className="mt-2 text-sm text-zinc-500">{position.quantity} × {position.average_price}</p>
                  </div>

                  <div className="rounded-3xl bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">Valor actual</p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {estimatedCurrentValue != null
                        ? new Intl.NumberFormat("es-ES", {
                            style: "currency",
                            currency: position.currency || "USD",
                          }).format(estimatedCurrentValue)
                        : "Pendiente"}
                    </p>
                    {estimatedCurrentValue != null ? (
                      <p className="mt-2 text-sm text-zinc-500">
                        {diffPercent != null
                          ? `${diffPercent >= 0 ? "+" : ""}${diffPercent.toFixed(2)}%`
                          : "--"}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-3xl bg-zinc-950/80 p-4 text-sm text-zinc-300">
                    <p className="text-[0.68rem] uppercase tracking-[0.24em] text-zinc-500">Plataforma</p>
                    <p className="mt-2 font-medium text-white">{position.platform ?? "Desconocida"}</p>
                  </div>
                  <div className="rounded-3xl bg-zinc-950/80 p-4 text-sm text-zinc-300">
                    <p className="text-[0.68rem] uppercase tracking-[0.24em] text-zinc-500">Moneda</p>
                    <p className="mt-2 font-medium text-white">{position.currency}</p>
                  </div>
                  <div className="rounded-3xl bg-zinc-950/80 p-4 text-sm text-zinc-300">
                    <p className="text-[0.68rem] uppercase tracking-[0.24em] text-zinc-500">Notas</p>
                    <p className="mt-2 font-medium text-white">{position.notes ?? "—"}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
