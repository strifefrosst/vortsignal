import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { fetchKlines } from "@/lib/market/binance";

const HORIZON_HOURS = 4;

type SignalRow = {
  id: number;
  symbol: string;
  signal_type: string | null;
  score: number | null;
  risk: string | null;
  source: string | null;
  price: number | string | null;
};

type EvaluationError = {
  signal_id: number;
  symbol: string;
  message: string;
};

export type EvaluationResult = {
  evaluatedCount: number;
  skippedCount: number;
  errors: EvaluationError[];
};

function normalizeSignalType(signalType: string | null) {
  return (signalType ?? "").trim().toUpperCase();
}

function calculatePctChange(entryPrice: number, exitPrice: number) {
  return ((exitPrice - entryPrice) / entryPrice) * 100;
}

function determineResult(signalType: string | null, pctChange: number) {
  const normalized = normalizeSignalType(signalType);

  if (normalized === "WAIT") {
    return "OBSERVED";
  }

  if (normalized === "LONG") {
    if (pctChange > 0.25) return "WIN";
    if (pctChange < -0.25) return "LOSS";
    return "FLAT";
  }

  if (normalized === "SHORT") {
    if (pctChange < -0.25) return "WIN";
    if (pctChange > 0.25) return "LOSS";
    return "FLAT";
  }

  return "OBSERVED";
}

export async function evaluateExpiredSignals(): Promise<EvaluationResult> {
  const adminClient = createAdminClient();
  const now = new Date().toISOString();

  const { data: signals, error: signalsError } = await adminClient
    .from("signals")
    .select("id, symbol, signal_type, score, risk, source, price")
    .lte("expires_at", now)
    .not("price", "is", null)
    .order("expires_at", { ascending: true })
    .limit(50);

  if (signalsError) {
    throw new Error(`No se pudieron leer señales: ${signalsError.message}`);
  }

  if (!signals?.length) {
    return {
      evaluatedCount: 0,
      skippedCount: 0,
      errors: [],
    };
  }

  const signalIds = signals.map((signal) => signal.id);
  const { data: existingOutcomes, error: existingError } = await adminClient
    .from("signal_outcomes")
    .select("signal_id")
    .eq("horizon_hours", HORIZON_HOURS)
    .in("signal_id", signalIds);

  if (existingError) {
    throw new Error(`No se pudieron leer resultados existentes: ${existingError.message}`);
  }

  const existingSignalIds = new Set<number>(
    existingOutcomes?.map((row: { signal_id: number }) => row.signal_id) ?? [],
  );

  let evaluatedCount = 0;
  let skippedCount = 0;
  const errors: EvaluationError[] = [];

  for (const signal of signals) {
    if (existingSignalIds.has(signal.id)) {
      skippedCount += 1;
      continue;
    }

    if (!signal.symbol) {
      skippedCount += 1;
      errors.push({
        signal_id: signal.id,
        symbol: "unknown",
        message: "Falta símbolo en la señal.",
      });
      continue;
    }

    const entryPrice = Number(signal.price);
    if (!Number.isFinite(entryPrice) || entryPrice <= 0) {
      skippedCount += 1;
      errors.push({
        signal_id: signal.id,
        symbol: signal.symbol,
        message: "Precio de entrada inválido.",
      });
      continue;
    }

    try {
      const klines = await fetchKlines(signal.symbol);
      const latest = klines.at(-1);

      if (!latest) {
        throw new Error("Binance no devolvió datos de velas.");
      }

      const exitPrice = latest.close;
      const pct_change = calculatePctChange(entryPrice, exitPrice);
      const result = determineResult(signal.signal_type, pct_change);
      const evaluatedAt = new Date().toISOString();

      const { error: upsertError } = await adminClient.from("signal_outcomes").upsert(
        {
          signal_id: signal.id,
          symbol: signal.symbol,
          signal_type: signal.signal_type ?? "UNKNOWN",
          score: signal.score,
          risk: signal.risk,
          source: signal.source ?? "evaluation",
          horizon_hours: HORIZON_HOURS,
          entry_price: entryPrice,
          exit_price: exitPrice,
          pct_change,
          result,
          evaluated_at: evaluatedAt,
          created_at: evaluatedAt,
        },
        {
          onConflict: "signal_id,horizon_hours",
        },
      );

      if (upsertError) {
        skippedCount += 1;
        errors.push({
          signal_id: signal.id,
          symbol: signal.symbol,
          message: `Falló guardado: ${upsertError.message}`,
        });
        continue;
      }

      evaluatedCount += 1;
    } catch (error) {
      skippedCount += 1;
      errors.push({
        signal_id: signal.id,
        symbol: signal.symbol,
        message:
          error instanceof Error
            ? error.message
            : "Error desconocido al evaluar símbolo.",
      });
    }
  }

  return {
    evaluatedCount,
    skippedCount,
    errors,
  };
}
