export type RiskLevel = "Bajo" | "Medio" | "Alto";

export type MockSignal = {
  pair: string;
  signal: string;
  score: number;
  risk: RiskLevel;
  timeframe: string;
  date: string;
};

export const mockSignals: MockSignal[] = [
  {
    pair: "BTC/USDC",
    signal: "Long moderado",
    score: 82,
    risk: "Medio",
    timeframe: "4H",
    date: "Hoy, 09:40",
  },
  {
    pair: "ETH/USDC",
    signal: "Esperar ruptura",
    score: 74,
    risk: "Medio",
    timeframe: "1H",
    date: "Hoy, 08:15",
  },
  {
    pair: "SOL/USDC",
    signal: "Momentum debil",
    score: 61,
    risk: "Alto",
    timeframe: "2H",
    date: "Ayer, 22:10",
  },
  {
    pair: "LINK/USDC",
    signal: "Acumulacion limpia",
    score: 78,
    risk: "Bajo",
    timeframe: "1D",
    date: "Ayer, 18:30",
  },
  {
    pair: "ARB/USDC",
    signal: "Pullback vigilado",
    score: 69,
    risk: "Medio",
    timeframe: "4H",
    date: "Ayer, 15:05",
  },
];

export const dashboardMetrics = [
  {
    label: "Senales activas",
    value: "12",
    detail: "+3 desde ayer",
    accent: "emerald",
  },
  {
    label: "Score medio",
    value: "73",
    detail: "Sesgo selectivo",
    accent: "blue",
  },
  {
    label: "Activos vigilados",
    value: "28",
    detail: "Top liquidez",
    accent: "violet",
  },
  {
    label: "Riesgo medio",
    value: "Medio",
    detail: "Exposicion contenida",
    accent: "emerald",
  },
] as const;
