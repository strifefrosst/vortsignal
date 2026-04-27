import "server-only";

import { getEnabledAssets } from "@/lib/config/assets";
import { getMarketSnapshots } from "@/lib/market/binance";
import { createNotificationsForSignals } from "@/lib/signals/notifications";
import { scoreSignal } from "@/lib/signals/scoring";
import { createAdminClient } from "@/lib/supabase/admin";

type SignalSource = "admin" | "cron" | "external";

function getExpiresAt() {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 4);

  return expiresAt.toISOString();
}

export async function generateSignals(source: SignalSource = "external") {
  const [snapshots, supabase] = await Promise.all([
    getMarketSnapshots(),
    Promise.resolve(createAdminClient()),
  ]);
  const assetsBySymbol = new Map(
    getEnabledAssets().map((asset) => [asset.symbol, asset]),
  );

  const generatedSignals = snapshots.map((snapshot) => {
    const score = scoreSignal(snapshot);
    const asset = assetsBySymbol.get(snapshot.symbol);

    return {
      symbol: snapshot.symbol,
      base_asset: asset?.baseAsset ?? snapshot.baseAsset,
      quote_asset: asset?.quoteAsset ?? snapshot.quoteAsset,
      signal_type: score.signal_type,
      score: score.score,
      risk: score.risk,
      timeframe: "1h",
      price: snapshot.price,
      reason: score.reason,
      rsi: snapshot.rsi,
      sma20: snapshot.sma20,
      volume_ratio: snapshot.volumeRatio,
      trend: snapshot.trend,
      source,
      expires_at: getExpiresAt(),
    };
  });

  if (generatedSignals.length === 0) {
    return {
      inserted: 0,
      signals: [],
    };
  }

  const { data, error } = await supabase
    .from("signals")
    .insert(generatedSignals)
    .select(
      "id, symbol, signal_type, score, risk, timeframe, price, reason, rsi, sma20, volume_ratio, trend, source, expires_at, created_at",
    );

  if (error) {
    throw new Error("Signal insert failed.");
  }

  const notifications = await createNotificationsForSignals(data ?? []);

  return {
    inserted: data?.length ?? 0,
    notifications,
    signals: data ?? [],
  };
}
