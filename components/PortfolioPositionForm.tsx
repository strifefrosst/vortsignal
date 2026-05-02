"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type PortfolioPositionFormProps = {};

const assetTypes = ["CRYPTO", "STOCK", "ETF", "FUND", "OTHER"] as const;

type AssetType = (typeof assetTypes)[number];

export default function PortfolioPositionForm({}: PortfolioPositionFormProps) {
  const router = useRouter();
  const [symbol, setSymbol] = useState("");
  const [assetName, setAssetName] = useState("");
  const [assetType, setAssetType] = useState<AssetType>("CRYPTO");
  const [quantity, setQuantity] = useState("0");
  const [averagePrice, setAveragePrice] = useState("0");
  const [currency, setCurrency] = useState("USD");
  const [platform, setPlatform] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage(null);

    const payload = {
      symbol: symbol.trim().toUpperCase(),
      asset_name: assetName.trim(),
      asset_type: assetType,
      quantity: Number(quantity),
      average_price: Number(averagePrice),
      currency: currency.trim().toUpperCase(),
      platform: platform.trim(),
      notes: notes.trim(),
    };

    if (!payload.symbol) {
      setStatus("error");
      setMessage("El símbolo es obligatorio.");
      return;
    }

    if (payload.quantity < 0 || Number.isNaN(payload.quantity)) {
      setStatus("error");
      setMessage("La cantidad debe ser un número igual o mayor a 0.");
      return;
    }

    if (payload.average_price < 0 || Number.isNaN(payload.average_price)) {
      setStatus("error");
      setMessage("El precio medio debe ser un número igual o mayor a 0.");
      return;
    }

    try {
      const response = await fetch("/api/portfolio/positions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "No se pudo guardar la posición.");
      }

      setStatus("success");
      setMessage("Posición guardada correctamente.");
      setSymbol("");
      setAssetName("");
      setAssetType("CRYPTO");
      setQuantity("0");
      setAveragePrice("0");
      setCurrency("USD");
      setPlatform("");
      setNotes("");
      router.refresh();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Error desconocido.");
    }
  }

  return (
    <form
      id="portfolio-form"
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-950/90 via-zinc-950/80 to-zinc-950/90 p-6 shadow-lg shadow-black/30"
    >
      <div className="mb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
              Añadir posición
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-white">Añadir nueva posición</h2>
          </div>
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.16em] text-zinc-300">
            Manual
          </span>
        </div>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Puedes registrar activos aunque todavía no tengan precio conectado.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-zinc-300">
          Símbolo
          <input
            value={symbol}
            onChange={(event) => setSymbol(event.target.value)}
            required
            className="h-14 rounded-2xl border border-white/10 bg-black/80 px-4 text-sm text-white outline-none ring-emerald-400/20 transition focus:border-emerald-400/50 focus:ring-4"
            placeholder="BTCUSDC, AAPL, VWCE..."
          />
        </label>

        <label className="grid gap-2 text-sm text-zinc-300">
          Nombre del activo
          <input
            value={assetName}
            onChange={(event) => setAssetName(event.target.value)}
            className="h-14 rounded-2xl border border-white/10 bg-black/80 px-4 text-sm text-white outline-none ring-emerald-400/20 transition focus:border-emerald-400/50 focus:ring-4"
            placeholder="Bitcoin, Apple, Vanguard FTSE..."
          />
        </label>

        <label className="grid gap-2 text-sm text-zinc-300">
          Tipo de activo
          <select
            value={assetType}
            onChange={(event) => setAssetType(event.target.value as AssetType)}
            className="h-14 rounded-2xl border border-white/10 bg-black/80 px-4 text-sm text-white outline-none ring-emerald-400/20 transition focus:border-emerald-400/50 focus:ring-4"
          >
            {assetTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm text-zinc-300">
          Cantidad
          <input
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            type="number"
            min="0"
            step="any"
            className="h-14 rounded-2xl border border-white/10 bg-black/80 px-4 text-sm text-white outline-none ring-emerald-400/20 transition focus:border-emerald-400/50 focus:ring-4"
          />
        </label>

        <label className="grid gap-2 text-sm text-zinc-300">
          Precio medio
          <input
            value={averagePrice}
            onChange={(event) => setAveragePrice(event.target.value)}
            type="number"
            min="0"
            step="any"
            className="h-14 rounded-2xl border border-white/10 bg-black/80 px-4 text-sm text-white outline-none ring-emerald-400/20 transition focus:border-emerald-400/50 focus:ring-4"
          />
        </label>

        <label className="grid gap-2 text-sm text-zinc-300">
          Moneda
          <input
            value={currency}
            onChange={(event) => setCurrency(event.target.value)}
            className="h-14 rounded-2xl border border-white/10 bg-black/80 px-4 text-sm text-white outline-none ring-emerald-400/20 transition focus:border-emerald-400/50 focus:ring-4"
            placeholder="USD"
          />
        </label>

        <label className="grid gap-2 text-sm text-zinc-300">
          Plataforma
          <input
            value={platform}
            onChange={(event) => setPlatform(event.target.value)}
            className="h-14 rounded-2xl border border-white/10 bg-black/80 px-4 text-sm text-white outline-none ring-emerald-400/20 transition focus:border-emerald-400/50 focus:ring-4"
            placeholder="Trade Republic, Revolut, Binance..."
          />
        </label>
      </div>

      <label className="mt-4 grid gap-2 text-sm text-zinc-300">
        Notas
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={4}
          className="rounded-3xl border border-white/10 bg-black/80 px-4 py-3 text-sm text-white outline-none ring-emerald-400/20 transition focus:border-emerald-400/50 focus:ring-4"
          placeholder="Observaciones sobre esta posición"
        />
      </label>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-400 px-5 py-4 text-sm font-semibold text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {status === "loading" ? "Guardando..." : "Añadir posición"}
        </button>
        {message ? (
          <p className={`text-sm ${status === "error" ? "text-red-300" : "text-emerald-200"}`}>
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
