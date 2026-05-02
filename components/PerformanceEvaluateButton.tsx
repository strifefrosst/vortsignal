"use client";

import { useState } from "react";

type EvaluationResponse = {
  evaluatedCount?: number;
  skippedCount?: number;
  errors?: Array<{ signal_id: number; symbol: string; message: string }>;
  error?: string;
};

export default function PerformanceEvaluateButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleEvaluate() {
    setStatus("loading");
    setMessage(null);

    try {
      const response = await fetch("/api/admin/performance/evaluate", {
        method: "POST",
        credentials: "same-origin",
      });
      const data = (await response.json()) as EvaluationResponse;

      if (!response.ok) {
        throw new Error(data.error ?? "No se pudo evaluar.");
      }

      setStatus("success");
      setMessage(
        `Evaluadas ${data.evaluatedCount ?? 0}, omitidas ${data.skippedCount ?? 0}.` +
          (data.errors && data.errors.length
            ? ` Errores: ${data.errors.length}.`
            : ""),
      );

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Error desconocido");
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-4 shadow-2xl shadow-black/20">
      <button
        type="button"
        onClick={handleEvaluate}
        disabled={status === "loading"}
        className="inline-flex items-center justify-center rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Evaluando..." : "Evaluar señales caducadas"}
      </button>
      <p className="mt-3 text-sm text-zinc-400">
        Esta acción revisa señales expired y escribe resultados en `signal_outcomes`.
      </p>
      {message ? (
        <p className={`mt-3 text-sm ${status === "error" ? "text-red-300" : "text-zinc-200"}`}>
          {message}
        </p>
      ) : null}
    </div>
  );
}
