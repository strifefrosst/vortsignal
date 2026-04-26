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

function isAuthorized(request: Request, secret: string) {
  const authorization = request.headers.get("authorization");
  const [scheme, token] = authorization?.split(" ") ?? [];

  return scheme === "Bearer" && token === secret;
}

export async function POST(request: Request) {
  const generateSecret = process.env.SIGNALS_GENERATE_SECRET;

  if (!generateSecret) {
    return Response.json(
      {
        error: "Falta configuracion segura para generar senales.",
      },
      {
        status: 500,
      },
    );
  }

  if (!isAuthorized(request, generateSecret)) {
    return Response.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  if (!process.env.SUPABASE_SECRET_KEY) {
    return Response.json(
      {
        error: "Falta configuracion segura de Supabase para generar senales.",
      },
      {
        status: 500,
      },
    );
  }

  try {
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
      .select("id, symbol, signal_type, score, risk, timeframe, price, reason, created_at");

    if (error) {
      return Response.json(
        {
          error: "No se pudieron guardar las senales generadas.",
        },
        {
          status: 500,
        },
      );
    }

    return Response.json({
      inserted: data?.length ?? 0,
      signals: data ?? [],
    });
  } catch {
    return Response.json(
      {
        error: "No se pudieron generar las senales de mercado.",
      },
      {
        status: 502,
      },
    );
  }
}
