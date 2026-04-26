import "server-only";

import { getMarketSnapshots } from "@/lib/market/binance";
import { scoreSignal } from "@/lib/signals/scoring";
import { createAdminClient } from "@/lib/supabase/admin";

function splitSymbol(symbol: string) {
  const quoteAssets = ["USDC", "USDT", "BTC", "ETH"];
  const quoteAsset = quoteAssets.find((quote) => symbol.endsWith(quote));

  if (!quoteAsset) {
    return {
      base_asset: symbol,
      quote_asset: "",
    };
  }

  return {
    base_asset: symbol.slice(0, -quoteAsset.length),
    quote_asset: quoteAsset,
  };
}

export async function generateSignals() {
  const [snapshots, supabase] = await Promise.all([
    getMarketSnapshots(),
    Promise.resolve(createAdminClient()),
  ]);

  const generatedSignals = snapshots.map((snapshot) => {
    const score = scoreSignal(snapshot);
    const assets = splitSymbol(snapshot.symbol);

    return {
      symbol: snapshot.symbol,
      ...assets,
      signal_type: score.signal_type,
      score: score.score,
      risk: score.risk,
      timeframe: "1h",
      price: snapshot.price,
      reason: score.reason,
    };
  });

  const { data, error } = await supabase
    .from("signals")
    .insert(generatedSignals)
    .select(
      "id, symbol, signal_type, score, risk, timeframe, price, reason, created_at",
    );

  if (error) {
    throw new Error("Signal insert failed.");
  }

  return {
    inserted: data?.length ?? 0,
    signals: data ?? [],
  };
}
