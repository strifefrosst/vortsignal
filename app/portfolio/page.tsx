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
    <div className="space-y-10">
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-6 rounded-3xl border border-white/10 bg-zinc-950/80 p-8 shadow-2xl shadow-black/20">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Cartera manual</p>
            <h1 className="text-4xl font-semibold text-white">Portafolio personal</h1>
            <p className="max-w-2xl text-base text-zinc-400">
              Registra y sigue tus posiciones fuera de la plataforma. Añade operaciones manuales, observa tu inversión total y monitorea el valor actual si hay precios disponibles.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-white/5 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">Posiciones</p>
              <p className="mt-3 text-3xl font-semibold text-white">{totals.count}</p>
            </div>
            <div className="rounded-3xl bg-white/5 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">Invertido total</p>
              <p className="mt-3 text-3xl font-semibold text-white">{formatCurrency(totals.invested)}</p>
            </div>
            <div className="rounded-3xl bg-white/5 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">Plataformas</p>
              <p className="mt-3 text-3xl font-semibold text-white">{platformList.length}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-3xl bg-zinc-950/80 p-5 text-sm text-zinc-300">
              <p className="uppercase tracking-[0.24em] text-zinc-500">Tipos de activos</p>
              <p className="mt-3 font-medium text-white">{investmentByType.join(" · ") || "Ninguno"}</p>
            </div>
            <div className="rounded-3xl bg-zinc-950/80 p-5 text-sm text-zinc-300">
              <p className="uppercase tracking-[0.24em] text-zinc-500">Moneda base</p>
              <p className="mt-3 font-medium text-white">USD</p>
            </div>
            <div className="rounded-3xl bg-zinc-950/80 p-5 text-sm text-zinc-300">
              <p className="uppercase tracking-[0.24em] text-zinc-500">Precios en tiempo real</p>
              <p className="mt-3 font-medium text-white">
                {Object.keys(priceMap).length > 0 ? "Disponible" : "No disponible"}
              </p>
            </div>
          </div>
        </div>

        <aside className="space-y-6 rounded-3xl border border-white/10 bg-zinc-950/80 p-8 shadow-2xl shadow-black/20">
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
            ]}
          />
        </aside>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-8 shadow-2xl shadow-black/20">
            <div className="flex flex-col gap-2">
              <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Gestión de posiciones</p>
              <h2 className="text-3xl font-semibold text-white">Tu portafolio</h2>
              <p className="max-w-2xl text-sm text-zinc-400">
                Administra tus posiciones y mantiene un historial de tus inversiones manuales.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <PortfolioPositionsList initialPositions={positions ?? []} cryptoPrices={priceMap} />
          </div>
        </div>

        <div className="space-y-6">
          <PortfolioPositionForm />
          <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 text-sm text-zinc-300">
            <p className="font-semibold text-white">Notas rápidas</p>
            <ul className="mt-4 space-y-3 list-disc pl-5">
              <li>Guarda operaciones para rastrear tu inversión fuera de señales automáticas.</li>
              <li>Los precios de cripto se muestran solo si están disponibles desde el snapshot de mercado.</li>
              <li>Esta cartera es manual y no afecta tus señales ni alertas.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
