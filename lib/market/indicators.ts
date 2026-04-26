export function sma(values: number[], period: number) {
  if (values.length < period) {
    return null;
  }

  const slice = values.slice(-period);
  const total = slice.reduce((sum, value) => sum + value, 0);

  return total / period;
}

export function rsi14(closes: number[]) {
  const period = 14;

  if (closes.length <= period) {
    return null;
  }

  const changes = closes.slice(1).map((close, index) => close - closes[index]);
  const recentChanges = changes.slice(-period);

  const gains = recentChanges
    .filter((change) => change > 0)
    .reduce((sum, gain) => sum + gain, 0);
  const losses = recentChanges
    .filter((change) => change < 0)
    .reduce((sum, loss) => sum + Math.abs(loss), 0);

  const averageGain = gains / period;
  const averageLoss = losses / period;

  if (averageLoss === 0) {
    return 100;
  }

  const relativeStrength = averageGain / averageLoss;

  return 100 - 100 / (1 + relativeStrength);
}

export function volumeRatio(volumes: number[], period = 20) {
  if (volumes.length < period) {
    return null;
  }

  const currentVolume = volumes.at(-1);
  const averageVolume = sma(volumes, period);

  if (!currentVolume || !averageVolume) {
    return null;
  }

  return currentVolume / averageVolume;
}

export type Trend = "alcista" | "bajista" | "neutral";

export function trend(currentPrice: number, movingAverage: number | null): Trend {
  if (!movingAverage) {
    return "neutral";
  }

  if (currentPrice > movingAverage) {
    return "alcista";
  }

  if (currentPrice < movingAverage) {
    return "bajista";
  }

  return "neutral";
}
