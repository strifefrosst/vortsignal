import AppShell from "@/components/AppShell";
import { createClient } from "@/lib/supabase/server";
import { getMarketSnapshots } from "@/lib/market/binance";
import PageHelp from "@/components/PageHelp";
import PortfolioPositionForm from "@/components/PortfolioPositionForm";
import PortfolioPositionsList from "@/components/PortfolioPositionsList";
import { redirect } from "next/navigation";

type PortfolioPosition = {
  id: number;
  symbol: string;
  asset_name: string | null;
  asset_type: string;
  quantity: number;
  average_price: number;
  currency: string;
  platform: string | null;
  notes: string | null;
};

function formatCurrency(value: number, currency = "USD") {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
  }).format(value);
}

export default async function PortfolioPage() {
  const supabase = await createClient();
  const { data: user, error: authError } = await supabase.auth.getUser();

  if (authError || !user?.user) {
    redirect("/login");
  }

  const [{ data: positions, error: positionsError }, snapshots] = await Promise.all([
    supabase
      .from("user_portfolio_positions")
      .select("id, symbol, asset_name, asset_type, quantity, average_price, currency, platform, notes")
      .eq("user_id", user.user.id),
    getMarketSnapshots().catch(() => null),
  ]);

  if (positionsError) {
    throw new Error("No se pudieron cargar las posiciones de la cartera.");
  }

  const priceMap = (snapshots ?? []).reduce<Record<string, number>>((map, snapshot) => {
    if (snapshot.symbol && snapshot.price) {
      map[snapshot.symbol.toUpperCase()] = Number(snapshot.price);
    }
    return map;
  }, {});

  const totals = positions?.reduce(
    (acc, position) => {
      acc.count += 1;
      acc.invested += position.average_price * position.quantity;
      acc.assetTypes.add(position.asset_type);
      if (position.platform) {
        acc.platforms.add(position.platform);
      }
      return acc;
    },
    {
      count: 0,
      invested: 0,
      assetTypes: new Set<string>(),
      platforms: new Set<string>(),
    }
  );

  const investmentByType = Array.from(totals.assetTypes).sort();
  const platformList = Array.from(totals.platforms).sort();

  return (
    <AppShell
      eyebrow="PORTAFOLIO"
      title="Controla tus inversiones manuales"
      description="Registra posiciones externas, estima exposición y prepara el análisis inteligente de cartera."
    >
      <div className="space-y-10">
        <section className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/20 md:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-2xl space-y-3">
              <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                Cartera manual
              </span>
              <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Controla tus inversiones manuales
              </h1>
              <p className="text-base leading-7 text-zinc-400 md:text-lg">
                Registra posiciones externas, estima exposición y prepara el análisis inteligente de cartera.
              </p>
              <p className="text-sm text-zinc-500">
                Información educativa. No constituye asesoramiento financiero personalizado.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 xl:flex-col xl:gap-3">
              <span className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-200">
                Importación CSV próximamente
              </span>
              <span className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-200">
                Capturas de portfolio próximamente
              </span>
              <span className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-200">
                Conexiones API futuras
              </span>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/5 p-5 shadow-lg shadow-black/10">
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">Posiciones</p>
              <p className="mt-2 text-2xl font-semibold text-white">{totals.count}</p>
            </div>
            <div className="rounded-2xl border border-sky-400/10 bg-sky-400/5 p-5 shadow-lg shadow-black/10">
              <p className="text-xs uppercase tracking-[0.18em] text-sky-200">Invertido total</p>
              <p className="mt-2 text-2xl font-semibold text-white">{formatCurrency(totals.invested)}</p>
            </div>
            <div className="rounded-2xl border border-violet-400/10 bg-violet-400/5 p-5 shadow-lg shadow-black/10">
              <p className="text-xs uppercase tracking-[0.18em] text-violet-200">Plataformas</p>
              <p className="mt-2 text-2xl font-semibold text-white">{platformList.length}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/10">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">Tipos de activos</p>
              <p className="mt-1 text-lg font-semibold text-white">{investmentByType.join(" · ") || "Ninguno"}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/10">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">Moneda base</p>
              <p className="mt-1 text-lg font-semibold text-white">USD</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/10">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">Precios en tiempo real</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {Object.keys(priceMap).length > 0 ? "Disponible" : "No disponible"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-lg shadow-black/10 xl:p-8">
            <PageHelp
              title="Guía de cartera"
              description="Usa esta sección para controlar tu portafolio manual y comparar tu inversión con precios actuales cuando estén disponibles."
              items={[
                {
                  label: "Registrar posiciones manuales",
                  description: "Agrega símbolos, cantidad, precio medio y plataforma para monitorear tu cartera.",
                },
                {
                  label: "Valor actual opcional",
                  description: "Si el activo es cripto y encontramos precio de mercado, calculamos el valor actualizado.",
                },
                {
                  label: "Eliminar y ajustar",
                  description: "Borra posiciones que ya no quieras ver y mantén tus datos al día.",
                },
                {
                  label: "Símbolos y nombres",
                  description: "Usa símbolos estándar como BTCUSDC para crypto, o AAPL para acciones. El nombre es opcional.",
                },
                {
                  label: "Plataformas externas",
                  description: "Registra de dónde viene la posición: Trade Republic, Revolut, Binance, etc.",
                },
              ]}
            />
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.85fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-lg shadow-black/10">
              <div className="flex flex-col gap-3">
                <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Tu portafolio</p>
                <h2 className="text-2xl font-semibold text-white">Posiciones y rendimiento</h2>
                <p className="max-w-2xl text-sm leading-6 text-zinc-400">
                  Revisa tus posiciones registradas y observa cómo se comportan con los precios disponibles.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <PortfolioPositionsList initialPositions={positions ?? []} cryptoPrices={priceMap} />
            </div>
          </div>

          <div className="space-y-6">
            <PortfolioPositionForm />
            <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-lg shadow-black/10">
              <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">Consejos rápidos</p>
              <ul className="mt-4 space-y-3 text-sm text-zinc-300">
                <li>Registra activos aunque todavía no tengan precio conectado.</li>
                <li>Mantén tu lista actualizada para ver un mejor panorama de exposición.</li>
                <li>Las posiciones manuales son independientes de señales y alertas.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
