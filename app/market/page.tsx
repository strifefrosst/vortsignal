import AppShell from "@/components/AppShell";
import { getMarketSnapshots, type MarketSnapshot } from "@/lib/market/binance";

function formatPrice(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value > 1000 ? 0 : 2,
  }).format(value);
}

function formatNumber(value: number | null, digits = 2) {
  if (value === null) {
    return "-";
  }

  return value.toFixed(digits);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(new Date(value))
    .replace(",", " ·");
}

function trendClass(trend: MarketSnapshot["trend"]) {
  if (trend === "alcista") {
    return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
  }

  if (trend === "bajista") {
    return "border-violet-400/30 bg-violet-400/10 text-violet-300";
  }

  return "border-sky-400/30 bg-sky-400/10 text-sky-300";
}

function MarketCard({ snapshot }: { snapshot: MarketSnapshot }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/30">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
            DATOS DE MERCADO
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
            {snapshot.symbol}
          </h2>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${trendClass(snapshot.trend)}`}
        >
          {snapshot.trend}
        </span>
      </div>

      <p className="mt-6 text-4xl font-black tracking-tight text-white">
        {formatPrice(snapshot.price)}
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-black p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
            RSI 14
          </p>
          <p className="mt-2 text-xl font-bold text-emerald-300">
            {formatNumber(snapshot.rsi)}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
            SMA 20
          </p>
          <p className="mt-2 text-xl font-bold text-sky-300">
            {snapshot.sma20 === null ? "-" : formatPrice(snapshot.sma20)}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
            Volumen
          </p>
          <p className="mt-2 text-xl font-bold text-violet-300">
            {formatNumber(snapshot.volumeRatio)}x
          </p>
        </div>
      </div>

      <p className="mt-5 text-sm text-zinc-500">
        Actualizado: {formatDate(snapshot.updatedAt)}
      </p>
    </article>
  );
}

export default async function MarketPage() {
  let snapshots: MarketSnapshot[] = [];
  let hasError = false;

  try {
    snapshots = await getMarketSnapshots();
  } catch {
    hasError = true;
  }

  return (
    <AppShell
      eyebrow="MERCADO"
      title="Pulso público de mercado, sin claves y sin operativa."
      description="Lectura de velas 1h para BTCUSDC, ETHUSDC y SOLUSDC con indicadores básicos."
    >
      {hasError ? (
        <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-8 shadow-2xl shadow-black/30">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-300">
            Binance no disponible
          </p>
          <h2 className="mt-3 text-2xl font-bold">
            No se pudo cargar el snapshot de mercado.
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-red-100/80">
            Puede ser un fallo temporal de red o de la API pública. La app no
            usa claves, no opera y no guarda datos en Supabase.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-3">
          {snapshots.map((snapshot) => (
            <MarketCard key={snapshot.symbol} snapshot={snapshot} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
