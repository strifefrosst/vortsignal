import { getEnabledAssets, type SupportedAsset } from "@/lib/config/assets";
import { rsi14, sma, trend, volumeRatio, type Trend } from "./indicators";

const BINANCE_DATA_BASE_URL = "https://data-api.binance.vision";

type BinanceKline = [
  number,
  string,
  string,
  string,
  string,
  string,
  number,
  string,
  number,
  string,
  string,
  string,
];

export type MarketKline = {
  openTime: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeTime: Date;
};

export type MarketSnapshot = {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  name: string;
  priority: number;
  price: number;
  rsi: number | null;
  sma20: number | null;
  volumeRatio: number | null;
  trend: Trend;
  updatedAt: string;
};

function parseNumber(value: string) {
  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    throw new Error("Binance returned an invalid numeric value.");
  }

  return parsed;
}

function parseKline(kline: BinanceKline): MarketKline {
  return {
    openTime: new Date(kline[0]),
    open: parseNumber(kline[1]),
    high: parseNumber(kline[2]),
    low: parseNumber(kline[3]),
    close: parseNumber(kline[4]),
    volume: parseNumber(kline[5]),
    closeTime: new Date(kline[6]),
  };
}

export async function fetchKlines(symbol: string) {
  const params = new URLSearchParams({
    symbol,
    interval: "1h",
    limit: "100",
  });

  const response = await fetch(
    `${BINANCE_DATA_BASE_URL}/api/v3/klines?${params.toString()}`,
    {
      next: {
        revalidate: 60,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Binance request failed for ${symbol}.`);
  }

  const data = (await response.json()) as BinanceKline[];

  return data.map(parseKline);
}

export async function getMarketSnapshot(
  asset: SupportedAsset,
): Promise<MarketSnapshot> {
  const klines = await fetchKlines(asset.symbol);
  const closes = klines.map((kline) => kline.close);
  const volumes = klines.map((kline) => kline.volume);
  const lastKline = klines.at(-1);

  if (!lastKline) {
    throw new Error(`Binance returned no candles for ${asset.symbol}.`);
  }

  const sma20 = sma(closes, 20);

  return {
    symbol: asset.symbol,
    baseAsset: asset.baseAsset,
    quoteAsset: asset.quoteAsset,
    name: asset.name,
    priority: asset.priority,
    price: lastKline.close,
    rsi: rsi14(closes),
    sma20,
    volumeRatio: volumeRatio(volumes, 20),
    trend: trend(lastKline.close, sma20),
    updatedAt: lastKline.closeTime.toISOString(),
  };
}

export async function getMarketSnapshots() {
  const results = await Promise.allSettled(
    getEnabledAssets().map((asset) => getMarketSnapshot(asset)),
  );

  return results
    .filter(
      (result): result is PromiseFulfilledResult<MarketSnapshot> =>
        result.status === "fulfilled",
    )
    .map((result) => result.value)
    .sort((a, b) => a.priority - b.priority);
}
