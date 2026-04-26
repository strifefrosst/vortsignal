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

function isBullishTrend(trend: ScoreSignalInput["trend"]) {
  return trend === "alcista" || trend === "bullish";
}

function isBearishTrend(trend: ScoreSignalInput["trend"]) {
  return trend === "bajista" || trend === "bearish";
}

function hasNumber(value: number | null): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function scoreSignal(input: ScoreSignalInput): ScoreSignalResult {
  const { symbol, price, rsi, sma20, volumeRatio, trend } = input;
  const bullishTrend = isBullishTrend(trend);
  const bearishTrend = isBearishTrend(trend);
  const hasVolumeConfirmation = hasNumber(volumeRatio) && volumeRatio > 1.1;
  const isAboveSma = hasNumber(sma20) && price > sma20;
  const isBelowSma = hasNumber(sma20) && price < sma20;

  if (hasNumber(rsi) && rsi > 75) {
    return {
      signal_type: "WAIT",
      score: clampScore(38 + Math.min((rsi - 75) * 2, 16)),
      risk: "HIGH",
      reason: `${symbol} muestra RSI elevado (${rsi.toFixed(1)}). Se evita perseguir largos por posible sobreextension; conviene esperar mejor estructura.`,
    };
  }

  if (hasNumber(rsi) && rsi < 25) {
    return {
      signal_type: "WAIT",
      score: clampScore(44 + Math.min((25 - rsi) * 2, 16)),
      risk: "HIGH",
      reason: `${symbol} esta en zona de RSI muy bajo (${rsi.toFixed(1)}). Puede existir rebote tecnico, pero el riesgo sigue alto y falta confirmacion prudente.`,
    };
  }

  if (
    bullishTrend &&
    hasNumber(rsi) &&
    rsi >= 45 &&
    rsi <= 70 &&
    hasVolumeConfirmation
  ) {
    return {
      signal_type: "LONG",
      score: clampScore(
        68 +
          (isAboveSma ? 8 : 0) +
          Math.min((volumeRatio - 1.1) * 12, 10) +
          Math.max(0, 70 - rsi) * 0.12,
      ),
      risk: rsi > 65 ? "MEDIUM" : "LOW",
      reason: `${symbol} combina tendencia alcista, precio ${isAboveSma ? "por encima" : "cerca"} de la SMA20, RSI en rango saludable (${rsi.toFixed(1)}) y volumen superior a su media. Es una posible lectura LONG, no una recomendacion financiera.`,
    };
  }

  if (
    bearishTrend &&
    hasNumber(rsi) &&
    rsi >= 30 &&
    rsi <= 55 &&
    hasVolumeConfirmation
  ) {
    return {
      signal_type: "SHORT",
      score: clampScore(
        66 +
          (isBelowSma ? 8 : 0) +
          Math.min((volumeRatio - 1.1) * 12, 10) +
          Math.max(0, rsi - 30) * 0.08,
      ),
      risk: rsi < 35 ? "HIGH" : "MEDIUM",
      reason: `${symbol} presenta sesgo bajista, precio ${isBelowSma ? "por debajo" : "cerca"} de la SMA20, RSI compatible con continuidad (${rsi.toFixed(1)}) y volumen por encima de la media. Es una posible lectura SHORT, no una promesa de resultado.`,
    };
  }

  return {
    signal_type: "WAIT",
    score: clampScore(
      42 +
        (bullishTrend || bearishTrend ? 8 : 0) +
        (hasVolumeConfirmation ? 6 : 0) +
        (hasNumber(rsi) && rsi >= 40 && rsi <= 60 ? 6 : 0),
    ),
    risk: "MEDIUM",
    reason: `${symbol} no muestra confluencia clara entre tendencia, RSI, SMA20 y volumen. La lectura prudente es esperar una confirmacion mas limpia antes de actuar.`,
  };
}
