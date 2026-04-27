export type SupportedAsset = {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  name: string;
  enabled: boolean;
  priority: number;
};

export const SUPPORTED_ASSETS: SupportedAsset[] = [
  {
    symbol: "BTCUSDC",
    baseAsset: "BTC",
    quoteAsset: "USDC",
    name: "Bitcoin",
    enabled: true,
    priority: 1,
  },
  {
    symbol: "ETHUSDC",
    baseAsset: "ETH",
    quoteAsset: "USDC",
    name: "Ethereum",
    enabled: true,
    priority: 2,
  },
  {
    symbol: "SOLUSDC",
    baseAsset: "SOL",
    quoteAsset: "USDC",
    name: "Solana",
    enabled: true,
    priority: 3,
  },
  {
    symbol: "XRPUSDC",
    baseAsset: "XRP",
    quoteAsset: "USDC",
    name: "XRP",
    enabled: true,
    priority: 4,
  },
  {
    symbol: "BNBUSDC",
    baseAsset: "BNB",
    quoteAsset: "USDC",
    name: "BNB",
    enabled: true,
    priority: 5,
  },
  {
    symbol: "ADAUSDC",
    baseAsset: "ADA",
    quoteAsset: "USDC",
    name: "Cardano",
    enabled: true,
    priority: 6,
  },
  {
    symbol: "DOGEUSDC",
    baseAsset: "DOGE",
    quoteAsset: "USDC",
    name: "Dogecoin",
    enabled: true,
    priority: 7,
  },
];

export function getEnabledAssets() {
  return SUPPORTED_ASSETS.filter((asset) => asset.enabled).sort(
    (a, b) => a.priority - b.priority,
  );
}
