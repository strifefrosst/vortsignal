export const planIds = ["FREE", "PRO", "ELITE"] as const;

export type PlanId = (typeof planIds)[number];

export type PlanConfig = {
  id: PlanId;
  name: string;
  priceLabel: string;
  description: string;
  watchlistLimit: number | null;
  alertsEnabled: boolean;
  advancedFiltersEnabled: boolean;
  badgeLabel: string;
  features: string[];
};

export const plans: Record<PlanId, PlanConfig> = {
  FREE: {
    id: "FREE",
    name: "Free",
    priceLabel: "0€",
    description: "Para probar el radar con una watchlist compacta.",
    watchlistLimit: 3,
    alertsEnabled: true,
    advancedFiltersEnabled: false,
    badgeLabel: "FREE",
    features: [
      "Hasta 3 activos en watchlist",
      "Alertas internas activas",
      "Filtros basicos de senales",
      "Acceso al dashboard principal",
    ],
  },
  PRO: {
    id: "PRO",
    name: "Pro",
    priceLabel: "14€/mes",
    description: "Para seguir mas activos y filtrar senales con precision.",
    watchlistLimit: 10,
    alertsEnabled: true,
    advancedFiltersEnabled: true,
    badgeLabel: "PRO",
    features: [
      "Hasta 10 activos en watchlist",
      "Alertas internas activas",
      "Filtros avanzados por score, riesgo y tipo",
      "Panel operativo completo",
    ],
  },
  ELITE: {
    id: "ELITE",
    name: "Elite",
    priceLabel: "29€/mes",
    description: "Para una vigilancia amplia sin limites de watchlist.",
    watchlistLimit: null,
    alertsEnabled: true,
    advancedFiltersEnabled: true,
    badgeLabel: "ELITE",
    features: [
      "Watchlist ilimitada",
      "Alertas internas activas",
      "Filtros avanzados por score, riesgo y tipo",
      "Preparado para acceso prioritario futuro",
    ],
  },
};

export function isPlanId(value: unknown): value is PlanId {
  return typeof value === "string" && planIds.includes(value as PlanId);
}

export function getPlanConfig(plan: string | null | undefined) {
  return isPlanId(plan) ? plans[plan] : getDefaultPlanConfig();
}

export function getDefaultPlanConfig() {
  return plans.FREE;
}

export function formatWatchlistLimit(limit: PlanConfig["watchlistLimit"]) {
  return limit === null ? "Ilimitada" : `${limit} activos`;
}
