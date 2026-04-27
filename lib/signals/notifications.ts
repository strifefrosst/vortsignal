import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

type GeneratedSignal = {
  id: string;
  symbol: string | null;
  signal_type: string | null;
  score: number | null;
  risk: string | null;
  reason: string | null;
};

type AlertSettingsRow = {
  user_id: string;
  enabled: boolean | null;
  watchlist_only: boolean | null;
  min_score: number | null;
  signal_types: string[] | null;
  risk_levels: string[] | null;
};

type WatchlistRow = {
  user_id: string;
  symbol: string;
};

type ExistingNotificationRow = {
  user_id: string;
  signal_id: string;
};

const fallbackSignalTypes = ["LONG", "SHORT"];
const fallbackRiskLevels = ["LOW", "MEDIUM"];

function notificationKey(userId: string, signalId: string) {
  return `${userId}:${signalId}`;
}

function matchesSetting(signal: GeneratedSignal, setting: AlertSettingsRow) {
  const minScore = setting.min_score ?? 70;
  const signalTypes =
    setting.signal_types && setting.signal_types.length > 0
      ? setting.signal_types
      : fallbackSignalTypes;
  const riskLevels =
    setting.risk_levels && setting.risk_levels.length > 0
      ? setting.risk_levels
      : fallbackRiskLevels;

  if (typeof signal.score !== "number" || signal.score < minScore) {
    return false;
  }

  if (!signal.signal_type || !signalTypes.includes(signal.signal_type)) {
    return false;
  }

  if (!signal.risk || !riskLevels.includes(signal.risk)) {
    return false;
  }

  return true;
}

function buildNotification(signal: GeneratedSignal, userId: string) {
  const signalType = signal.signal_type ?? "WAIT";
  const score = typeof signal.score === "number" ? signal.score : 0;
  const symbol = signal.symbol ?? "Mercado";

  return {
    user_id: userId,
    signal_id: signal.id,
    symbol: signal.symbol,
    title: `${symbol}: señal ${signalType} con score ${score}`,
    body:
      signal.reason ??
      "Nueva lectura interna generada según tu configuración de alertas.",
  };
}

export async function createNotificationsForSignals(signals: GeneratedSignal[]) {
  const signalsWithId = signals.filter((signal) => signal.id);

  if (signalsWithId.length === 0) {
    return {
      created: 0,
      skipped: 0,
    };
  }

  const supabase = createAdminClient();
  const { data: settingsData, error: settingsError } = await supabase
    .from("user_alert_settings")
    .select(
      "user_id, enabled, watchlist_only, min_score, signal_types, risk_levels",
    )
    .eq("enabled", true);

  if (settingsError || !settingsData || settingsData.length === 0) {
    return {
      created: 0,
      skipped: signalsWithId.length,
    };
  }

  const settings = settingsData as AlertSettingsRow[];
  const signalIds = signalsWithId.map((signal) => signal.id);
  const watchlistUserIds = settings
    .filter((setting) => setting.watchlist_only ?? true)
    .map((setting) => setting.user_id);

  const [watchlistResult, existingResult] = await Promise.all([
    watchlistUserIds.length > 0
      ? supabase
          .from("user_watchlist")
          .select("user_id, symbol")
          .in("user_id", watchlistUserIds)
      : Promise.resolve({ data: [], error: null }),
    supabase
      .from("user_notifications")
      .select("user_id, signal_id")
      .in("signal_id", signalIds),
  ]);

  if (watchlistResult.error || existingResult.error) {
    return {
      created: 0,
      skipped: signalsWithId.length,
    };
  }

  const watchlistSymbolsByUser = new Map<string, Set<string>>();
  ((watchlistResult.data ?? []) as WatchlistRow[]).forEach((row) => {
    const symbols = watchlistSymbolsByUser.get(row.user_id) ?? new Set<string>();
    symbols.add(row.symbol);
    watchlistSymbolsByUser.set(row.user_id, symbols);
  });

  const existingNotifications = new Set(
    ((existingResult.data ?? []) as ExistingNotificationRow[]).map((row) =>
      notificationKey(row.user_id, row.signal_id),
    ),
  );
  const notifications = settings.flatMap((setting) => {
    const watchlistSymbols = watchlistSymbolsByUser.get(setting.user_id);

    return signalsWithId.flatMap((signal) => {
      if (!matchesSetting(signal, setting)) {
        return [];
      }

      if (
        (setting.watchlist_only ?? true) &&
        (!signal.symbol || !watchlistSymbols?.has(signal.symbol))
      ) {
        return [];
      }

      if (existingNotifications.has(notificationKey(setting.user_id, signal.id))) {
        return [];
      }

      return [buildNotification(signal, setting.user_id)];
    });
  });

  if (notifications.length === 0) {
    return {
      created: 0,
      skipped: signalsWithId.length,
    };
  }

  const { error } = await supabase
    .from("user_notifications")
    .insert(notifications);

  if (error) {
    return {
      created: 0,
      skipped: signalsWithId.length,
    };
  }

  return {
    created: notifications.length,
    skipped: 0,
  };
}
