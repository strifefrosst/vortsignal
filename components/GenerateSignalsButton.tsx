"use client";

import { useState } from "react";

type GenerateState =
  | {
      status: "idle";
      message: string;
    }
  | {
      status: "loading";
      message: string;
    }
  | {
      status: "success";
      message: string;
      inserted: number;
    }
  | {
      status: "error";
      message: string;
    };

function getErrorMessage(payload: unknown) {
  if (
    payload &&
    typeof payload === "object" &&
    "error" in payload &&
    typeof payload.error === "string"
  ) {
    return payload.error;
  }

  return "No se pudieron generar las señales.";
}

function getInsertedCount(payload: unknown) {
  if (
    payload &&
    typeof payload === "object" &&
    "inserted" in payload &&
    typeof payload.inserted === "number"
  ) {
    return payload.inserted;
  }

  return 0;
}

export default function GenerateSignalsButton() {
  const [state, setState] = useState<GenerateState>({
    status: "idle",
    message: "Listo para lanzar una generación manual segura.",
  });

  async function handleGenerate() {
    setState({
      status: "loading",
      message: "Generando señales desde el servidor...",
    });

    try {
      const response = await fetch("/api/admin/signals/generate", {
        method: "POST",
      });
      const payload: unknown = await response.json();

      if (!response.ok) {
        setState({
          status: "error",
          message: getErrorMessage(payload),
        });
        return;
      }

      const inserted = getInsertedCount(payload);
      setState({
        status: "success",
        inserted,
        message:
          inserted === 1
            ? "Se generó 1 señal nueva."
            : `Se generaron ${inserted} señales nuevas.`,
      });
    } catch {
      setState({
        status: "error",
        message: "No se pudo conectar con el generador de señales.",
      });
    }
  }

  const isLoading = state.status === "loading";

  return (
    <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-6 shadow-2xl shadow-black/30">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
            Generador privado
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight">
            Crear señales ahora
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            La llamada se ejecuta contra una ruta admin protegida. Las claves se
            quedan en el servidor.
          </p>
        </div>

        <button
          type="button"
          disabled={isLoading}
          onClick={handleGenerate}
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
        >
          {isLoading ? "Generando..." : "Generar señales"}
        </button>
      </div>

      <div
        className={`mt-5 rounded-xl border px-4 py-3 text-sm ${
          state.status === "error"
            ? "border-red-400/20 bg-red-400/10 text-red-200"
            : state.status === "success"
              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
              : "border-white/10 bg-black/30 text-zinc-400"
        }`}
      >
        {state.message}
      </div>
    </div>
  );
}
