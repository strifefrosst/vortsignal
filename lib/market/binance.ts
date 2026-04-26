import { rsi14, sma, trend, volumeRatio, type Trend } from "./indicators";

const BINANCE_DATA_BASE_URL = "https://data-api.binance.vision";
const DEFAULT_SYMBOLS = ["BTCUSDC", "ETHUSDC", "SOLUSDC"] as const;

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

export async function getMarketSnapshot(symbol = ""): Promise<MarketSnapshot> {
  const klines = await fetchKlines(symbol);
  const closes = klines.map((kline) => kline.close);
  const volumes = klines.map((kline) => kline.volume);
  const lastKline = klines.at(-1);

  if (!lastKline) {
    throw new Error(`Binance returned no candles for ${symbol}.`);
  }

  const sma20 = sma(closes, 20);

  return {
    symbol,
    price: lastKline.close,
    rsi: rsi14(closes),
    sma20,
    volumeRatio: volumeRatio(volumes, 20),
    trend: trend(lastKline.close, sma20),
    updatedAt: lastKline.closeTime.toISOString(),
  };
}

export async function getMarketSnapshots() {
  return Promise.all(
    DEFAULT_SYMBOLS.map((symbol) => getMarketSnapshot(symbol)),
  );
}
