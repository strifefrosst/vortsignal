import type { Trend } from "@/lib/market/indicators";

export type SignalType = "LONG" | "SHORT" | "WAIT";
export type SignalRisk = "LOW" | "MEDIUM" | "HIGH";

export type ScoreSignalInput = {
  symbol: string;
  price: number;
  rsi: number | null;
  sma20: number | null;
  volumeRatio: number | null;
  trend: Trend | "bullish" | "bearish";
};

export type ScoreSignalResult = {
  signal_type: SignalType;
  score: number;
  risk: SignalRisk;
  reason: string;
};

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function scoreInRange(score: number, min: number, max: number) {
  return Math.max(min, Math.min(max, clampScore(score)));
}

function isBullishTrend(trend: ScoreSignalInput["trend"]) {
  return trend === "alcista" || trend === "bullish";
}

function isBearishTrend(trend: ScoreSignalInput["trend"]) {
  return trend === "bajista" || trend === "bearish";
}

function hasNumber(value: number | null): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function formatNumber(value: number | null, digits = 1) {
  if (!hasNumber(value)) {
    return "sin dato";
  }

  return value.toFixed(digits);
}

function formatPriceVsSma(price: number, sma20: number | null) {
  if (!hasNumber(sma20)) {
    return "SMA20 sin dato suficiente";
  }

  if (price >= sma20) {
    return `precio por encima de la SMA20 (${formatNumber(sma20, 2)})`;
  }

  return `precio por debajo de la SMA20 (${formatNumber(sma20, 2)})`;
}

function formatTrendLabel(trend: ScoreSignalInput["trend"]) {
  if (isBullishTrend(trend)) {
    return "alcista";
  }

  if (isBearishTrend(trend)) {
    return "bajista";
  }

  return "neutral";
}

function buildReason({
  symbol,
  summary,
  rsi,
  trend,
  volumeRatio,
  price,
  sma20,
}: {
  symbol: string;
  summary: string;
  rsi: number | null;
  trend: ScoreSignalInput["trend"];
  volumeRatio: number | null;
  price: number;
  sma20: number | null;
}) {
  return `${symbol}: ${summary}. RSI ${formatNumber(rsi)}, tendencia ${formatTrendLabel(trend)}, volumen relativo ${formatNumber(volumeRatio, 2)}x y ${formatPriceVsSma(price, sma20)}.`;
}

export function scoreSignal(input: ScoreSignalInput): ScoreSignalResult {
  const { symbol, price, rsi, sma20, volumeRatio, trend } = input;
  const bullishTrend = isBullishTrend(trend);
  const bearishTrend = isBearishTrend(trend);
  const isAboveOrAtSma = hasNumber(sma20) && price >= sma20;
  const isBelowOrAtSma = hasNumber(sma20) && price <= sma20;

  if (hasNumber(rsi) && rsi >= 75) {
    return {
      signal_type: "WAIT",
      score: scoreInRange(48 + (rsi - 75) * 1.4, 45, 60),
      risk: "HIGH",
      reason: buildReason({
        symbol,
        summary:
          "lectura prudente de sobrecompra; se evita perseguir largos por posible sobreextensión y se espera confirmación más limpia",
        rsi,
        trend,
        volumeRatio,
        price,
        sma20,
      }),
    };
  }

  if (hasNumber(rsi) && rsi <= 25) {
    return {
      signal_type: "WAIT",
      score: scoreInRange(46 + (25 - rsi) * 1.5, 45, 60),
      risk: "HIGH",
      reason: buildReason({
        symbol,
        summary:
          "posible rebote por sobreventa, pero falta confirmación suficiente y el riesgo sigue alto",
        rsi,
        trend,
        volumeRatio,
        price,
        sma20,
      }),
    };
  }

  if (
    bullishTrend &&
    hasNumber(rsi) &&
    rsi >= 45 &&
    rsi <= 68 &&
    hasNumber(volumeRatio) &&
    volumeRatio >= 1.4 &&
    isAboveOrAtSma
  ) {
    const score = scoreInRange(
      78 +
        Math.min((volumeRatio - 1.4) * 10, 6) +
        Math.max(0, 62 - rsi) * 0.25,
      78,
      92,
    );

    return {
      signal_type: "LONG",
      score,
      risk: rsi > 64 || volumeRatio < 1.8 ? "MEDIUM" : "LOW",
      reason: buildReason({
        symbol,
        summary:
          "posible LONG fuerte por confluencia alcista, volumen de confirmación y precio sosteniéndose sobre SMA20",
        rsi,
        trend,
        volumeRatio,
        price,
        sma20,
      }),
    };
  }

  if (
    bullishTrend &&
    hasNumber(rsi) &&
    rsi >= 50 &&
    rsi <= 65 &&
    hasNumber(volumeRatio) &&
    volumeRatio >= 0.9 &&
    volumeRatio <= 1.2
  ) {
    return {
      signal_type: "WAIT",
      score: scoreInRange(
        55 + (isAboveOrAtSma ? 4 : 0) + Math.max(0, rsi - 50) * 0.25,
        55,
        65,
      ),
      risk: "MEDIUM",
      reason: buildReason({
        symbol,
        summary:
          "estructura favorable de acumulación o ruptura potencial, pero falta volumen de confirmación para una señal direccional",
        rsi,
        trend,
        volumeRatio,
        price,
        sma20,
      }),
    };
  }

  if (
    bullishTrend &&
    hasNumber(rsi) &&
    rsi >= 40 &&
    rsi <= 72 &&
    hasNumber(volumeRatio) &&
    volumeRatio >= 1.05
  ) {
    return {
      signal_type: "LONG",
      score: scoreInRange(
        62 +
          (isAboveOrAtSma ? 6 : 0) +
          Math.min((volumeRatio - 1.05) * 10, 6) +
          Math.max(0, 62 - Math.abs(rsi - 56)) * 0.04,
        62,
        77,
      ),
      risk: rsi > 68 || !isAboveOrAtSma ? "MEDIUM" : "LOW",
      reason: buildReason({
        symbol,
        summary:
          "posible LONG moderado por tendencia alcista y confluencia parcial; lectura prudente mientras se confirma continuidad",
        rsi,
        trend,
        volumeRatio,
        price,
        sma20,
      }),
    };
  }

  if (
    bearishTrend &&
    hasNumber(rsi) &&
    rsi >= 32 &&
    rsi <= 58 &&
    hasNumber(volumeRatio) &&
    volumeRatio >= 1.4 &&
    isBelowOrAtSma
  ) {
    return {
      signal_type: "SHORT",
      score: scoreInRange(
        78 +
          Math.min((volumeRatio - 1.4) * 10, 6) +
          Math.max(0, rsi - 36) * 0.18,
        78,
        92,
      ),
      risk: rsi < 38 || volumeRatio > 1.8 ? "HIGH" : "MEDIUM",
      reason: buildReason({
        symbol,
        summary:
          "posible SHORT fuerte por confluencia bajista, volumen de confirmación y precio presionando bajo SMA20",
        rsi,
        trend,
        volumeRatio,
        price,
        sma20,
      }),
    };
  }

  if (
    bearishTrend &&
    hasNumber(rsi) &&
    rsi >= 35 &&
    rsi <= 50 &&
    hasNumber(volumeRatio) &&
    volumeRatio < 1
  ) {
    return {
      signal_type: "WAIT",
      score: scoreInRange(
        45 + (isBelowOrAtSma ? 5 : 0) + Math.max(0, 50 - rsi) * 0.25,
        45,
        58,
      ),
      risk: "MEDIUM",
      reason: buildReason({
        symbol,
        summary:
          "hay debilidad bajista, pero falta presión vendedora clara para confirmar continuidad",
        rsi,
        trend,
        volumeRatio,
        price,
        sma20,
      }),
    };
  }

  if (
    bearishTrend &&
    hasNumber(rsi) &&
    rsi >= 28 &&
    rsi <= 60 &&
    hasNumber(volumeRatio) &&
    volumeRatio >= 1.05
  ) {
    return {
      signal_type: "SHORT",
      score: scoreInRange(
        62 +
          (isBelowOrAtSma ? 6 : 0) +
          Math.min((volumeRatio - 1.05) * 10, 6) +
          Math.max(0, rsi - 34) * 0.08,
        62,
        77,
      ),
      risk: rsi < 34 || volumeRatio > 1.55 ? "HIGH" : "MEDIUM",
      reason: buildReason({
        symbol,
        summary:
          "posible SHORT moderado por tendencia bajista y confluencia parcial; lectura prudente mientras se confirma presión",
        rsi,
        trend,
        volumeRatio,
        price,
        sma20,
      }),
    };
  }

  return {
    signal_type: "WAIT",
    score: scoreInRange(
      40 +
        (bullishTrend || bearishTrend ? 8 : 0) +
        (hasNumber(volumeRatio) && volumeRatio >= 1 ? 4 : 0) +
        (hasNumber(rsi) && rsi >= 40 && rsi <= 60 ? 3 : 0) +
        (isAboveOrAtSma || isBelowOrAtSma ? 1 : 0),
      40,
      55,
    ),
    risk: "MEDIUM",
    reason: buildReason({
      symbol,
      summary:
        "no hay confluencia suficiente entre tendencia, RSI, volumen relativo y SMA20; lectura prudente en espera de confirmación",
      rsi,
      trend,
      volumeRatio,
      price,
      sma20,
    }),
  };
}
