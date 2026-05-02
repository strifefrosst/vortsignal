import { NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe/server";

interface EnvCheck {
  key: string;
  configured: boolean;
  label: string;
}

interface DbCheck {
  table: string;
  accessible: boolean;
  count?: number;
  error?: string;
}

interface SignalCheck {
  lastSignal?: {
    symbol: string;
    signal_type: string;
    score: number;
    source: string;
    created_at: string;
    expires_at: string;
  };
  recentCronCount: number;
  recentAdminCount: number;
  status: "healthy" | "warning" | "error";
}

interface BinanceCheck {
  ok: boolean;
  price?: number;
  symbol?: string;
  error?: string;
}

interface StripeCheck {
  proPriceConfigured: boolean;
  elitePriceConfigured: boolean;
  stripeReachable: boolean;
  proPriceInfo?: {
    currency: string;
    recurring: string;
  };
  elitePriceInfo?: {
    currency: string;
    recurring: string;
  };
  error?: string;
}

interface StatusResponse {
  timestamp: string;
  environment: {
    checks: EnvCheck[];
    allConfigured: boolean;
  };
  database: {
    checks: DbCheck[];
    allAccessible: boolean;
  };
  signals: SignalCheck;
  binance: BinanceCheck;
  stripe: StripeCheck;
  summary: {
    healthy: number;
    warning: number;
    error: number;
  };
}

function checkEnvVar(key: string, label: string): EnvCheck {
  const value = process.env[key];
  return {
    key,
    configured: !!value && value.length > 0,
    label,
  };
}

export async function GET() {
  // Check authentication
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "No autenticado" },
      { status: 401 }
    );
  }

  if (!isAdminEmail(user.email)) {
    return NextResponse.json(
      { error: "Acceso denegado" },
      { status: 403 }
    );
  }

  const response: StatusResponse = {
    timestamp: new Date().toISOString(),
    environment: {
      checks: [],
      allConfigured: false,
    },
    database: {
      checks: [],
      allAccessible: false,
    },
    signals: {
      recentCronCount: 0,
      recentAdminCount: 0,
      status: "error",
    },
    binance: {
      ok: false,
    },
    stripe: {
      proPriceConfigured: false,
      elitePriceConfigured: false,
      stripeReachable: false,
    },
    summary: {
      healthy: 0,
      warning: 0,
      error: 0,
    },
  };

  // Environment checks
  const envVars = [
    { key: "NEXT_PUBLIC_SUPABASE_URL", label: "Supabase URL" },
    { key: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", label: "Supabase Key" },
    { key: "SUPABASE_SECRET_KEY", label: "Supabase Secret" },
    { key: "ADMIN_EMAILS", label: "Admin Emails" },
    { key: "CRON_SECRET", label: "Cron Secret" },
    { key: "SIGNALS_GENERATE_SECRET", label: "Signals Secret" },
    { key: "STRIPE_SECRET_KEY", label: "Stripe Secret" },
    { key: "STRIPE_WEBHOOK_SECRET", label: "Stripe Webhook" },
    { key: "STRIPE_PRO_PRICE_ID", label: "Stripe Pro Price" },
    { key: "STRIPE_ELITE_PRICE_ID", label: "Stripe Elite Price" },
    { key: "NEXT_PUBLIC_APP_URL", label: "App URL" },
  ];

  response.environment.checks = envVars.map((v) =>
    checkEnvVar(v.key, v.label)
  );
  response.environment.allConfigured = response.environment.checks.every(
    (c) => c.configured
  );

  // Database checks
  const adminClient = createAdminClient();
  const tables = ["signals", "user_plans", "watchlist", "notifications"];

  for (const table of tables) {
    const { count, error } = await adminClient
      .from(table)
      .select("*", { count: "exact", head: true });

    response.database.checks.push({
      table,
      accessible: !error,
      count: count ?? undefined,
      error: error?.message,
    });
  }

  response.database.allAccessible = response.database.checks.every(
    (c) => c.accessible
  );

  // Signals checks
  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last48h = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  const last72h = new Date(now.getTime() - 72 * 60 * 60 * 1000);

  const { data: lastSignal } = await adminClient
    .from("signals")
    .select("symbol, signal_type, score, source, created_at, expires_at")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lastSignal) {
    response.signals.lastSignal = lastSignal as any;
  }

  const { count: cronCount } = await adminClient
    .from("signals")
    .select("*", { count: "exact", head: true })
    .eq("source", "cron")
    .gte("created_at", last48h.toISOString());

  const { count: adminCount } = await adminClient
    .from("signals")
    .select("*", { count: "exact", head: true })
    .eq("source", "admin")
    .gte("created_at", last48h.toISOString());

  response.signals.recentCronCount = cronCount ?? 0;
  response.signals.recentAdminCount = adminCount ?? 0;

  const { count: last24hCount } = await adminClient
    .from("signals")
    .select("*", { count: "exact", head: true })
    .gte("created_at", last24h.toISOString());

  if ((last24hCount ?? 0) > 0) {
    response.signals.status = "healthy";
  } else {
    const { count: last72hCount } = await adminClient
      .from("signals")
      .select("*", { count: "exact", head: true })
      .gte("created_at", last72h.toISOString());

    if ((last72hCount ?? 0) > 0) {
      response.signals.status = "warning";
    } else {
      response.signals.status = "error";
    }
  }

  // Binance check
  try {
    const binanceUrl = "https://api.binance.com/api/v3/ticker/price";
    const btcResponse = await fetch(`${binanceUrl}?symbol=BTCUSDT`, {
      next: { revalidate: 30 },
    });

    if (btcResponse.ok) {
      const btcData = await btcResponse.json();
      response.binance = {
        ok: true,
        price: parseFloat(btcData.price),
        symbol: "BTCUSDT",
      };
    } else {
      response.binance = {
        ok: false,
        error: `HTTP ${btcResponse.status}`,
      };
    }
  } catch (err) {
    response.binance = {
      ok: false,
      error: err instanceof Error ? err.message : "Error desconocido",
    };
  }

  // Stripe check
  const proPriceId = process.env.STRIPE_PRO_PRICE_ID;
  const elitePriceId = process.env.STRIPE_ELITE_PRICE_ID;

  if (proPriceId && elitePriceId) {
    try {
      const [proPrice, elitePrice] = await Promise.all([
        stripe.prices.retrieve(proPriceId),
        stripe.prices.retrieve(elitePriceId),
      ]);

      response.stripe = {
        proPriceConfigured: true,
        elitePriceConfigured: true,
        stripeReachable: true,
        proPriceInfo: proPrice.unit_amount
          ? {
              currency: proPrice.currency.toUpperCase(),
              recurring: proPrice.recurring
                ? proPrice.recurring.interval
                : "one-time",
            }
          : undefined,
        elitePriceInfo: elitePrice.unit_amount
          ? {
              currency: elitePrice.currency.toUpperCase(),
              recurring: elitePrice.recurring
                ? elitePrice.recurring.interval
                : "one-time",
            }
          : undefined,
      };
    } catch (err) {
      response.stripe = {
        proPriceConfigured: !!proPriceId,
        elitePriceConfigured: !!elitePriceId,
        stripeReachable: false,
        error: err instanceof Error ? err.message : "Error desconocido",
      };
    }
  } else {
    response.stripe = {
      proPriceConfigured: !!proPriceId,
      elitePriceConfigured: !!elitePriceId,
      stripeReachable: false,
      error: "Price IDs no configurados",
    };
  }

  // Summary
  response.summary = {
    healthy: 0,
    warning: 0,
    error: 0,
  };

  if (response.environment.allConfigured) {
    response.summary.healthy++;
  } else {
    response.summary.error++;
  }

  if (response.database.allAccessible) {
    response.summary.healthy++;
  } else {
    response.summary.error++;
  }

  if (response.signals.status === "healthy") {
    response.summary.healthy++;
  } else if (response.signals.status === "warning") {
    response.summary.warning++;
  } else {
    response.summary.error++;
  }

  if (response.binance.ok) {
    response.summary.healthy++;
  } else {
    response.summary.error++;
  }

  if (response.stripe.stripeReachable) {
    response.summary.healthy++;
  } else if (
    response.stripe.proPriceConfigured &&
    response.stripe.elitePriceConfigured
  ) {
    response.summary.warning++;
  } else {
    response.summary.error++;
  }

  return NextResponse.json(response);
}