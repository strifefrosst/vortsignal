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
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/30"
    >
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
            Añadir posición
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">Registrar nueva posición</h2>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.16em] text-zinc-300">
          Manual
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-zinc-300">
          Símbolo
          <input
            value={symbol}
            onChange={(event) => setSymbol(event.target.value)}
            required
            className="h-12 rounded-xl border border-white/10 bg-black px-4 text-sm text-white outline-none ring-emerald-400/20 transition focus:border-emerald-400/50 focus:ring-4"
            placeholder="BTCUSDT"
          />
        </label>

        <label className="grid gap-2 text-sm text-zinc-300">
          Nombre del activo
          <input
            value={assetName}
            onChange={(event) => setAssetName(event.target.value)}
            className="h-12 rounded-xl border border-white/10 bg-black px-4 text-sm text-white outline-none ring-emerald-400/20 transition focus:border-emerald-400/50 focus:ring-4"
            placeholder="Bitcoin"
          />
        </label>

        <label className="grid gap-2 text-sm text-zinc-300">
          Tipo de activo
          <select
            value={assetType}
            onChange={(event) => setAssetType(event.target.value as AssetType)}
            className="h-12 rounded-xl border border-white/10 bg-black px-4 text-sm text-white outline-none ring-emerald-400/20 transition focus:border-emerald-400/50 focus:ring-4"
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
            className="h-12 rounded-xl border border-white/10 bg-black px-4 text-sm text-white outline-none ring-emerald-400/20 transition focus:border-emerald-400/50 focus:ring-4"
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
            className="h-12 rounded-xl border border-white/10 bg-black px-4 text-sm text-white outline-none ring-emerald-400/20 transition focus:border-emerald-400/50 focus:ring-4"
          />
        </label>

        <label className="grid gap-2 text-sm text-zinc-300">
          Moneda
          <input
            value={currency}
            onChange={(event) => setCurrency(event.target.value)}
            className="h-12 rounded-xl border border-white/10 bg-black px-4 text-sm text-white outline-none ring-emerald-400/20 transition focus:border-emerald-400/50 focus:ring-4"
            placeholder="USD"
          />
        </label>

        <label className="grid gap-2 text-sm text-zinc-300">
          Plataforma
          <input
            value={platform}
            onChange={(event) => setPlatform(event.target.value)}
            className="h-12 rounded-xl border border-white/10 bg-black px-4 text-sm text-white outline-none ring-emerald-400/20 transition focus:border-emerald-400/50 focus:ring-4"
            placeholder="Binance, Revolut, Trade Republic"
          />
        </label>
      </div>

      <label className="mt-4 grid gap-2 text-sm text-zinc-300">
        Notas
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={4}
          className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none ring-emerald-400/20 transition focus:border-emerald-400/50 focus:ring-4"
          placeholder="Observaciones sobre esta posición"
        />
      </label>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? "Guardando..." : "Guardar posición"}
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
