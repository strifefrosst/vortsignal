import AppShell from "@/components/AppShell";
import CheckoutButton from "@/components/CheckoutButton";
import { formatWatchlistLimit, plans } from "@/lib/plans/config";
import { getUserPlan } from "@/lib/plans/server";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PricingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const currentPlan = user ? (await getUserPlan(user.id)).plan.id : null;
  const planList = [plans.FREE, plans.PRO, plans.ELITE];

  return (
    <AppShell
      eyebrow="PLANES"
      title="Planes simples para crecer de radar a operativa."
      description="Limites reales activos desde hoy. Los pagos con Stripe llegaran mas adelante."
    >
      <div className="grid gap-5 lg:grid-cols-3">
        {planList.map((plan) => {
          const isCurrent = plan.id === currentPlan;
          const isFeatured = plan.id === "PRO";

          return (
            <div
              key={plan.id}
              className={`rounded-2xl border p-6 shadow-2xl shadow-black/30 ${
                isFeatured
                  ? "border-emerald-400/40 bg-emerald-400/[0.08]"
                  : "border-white/10 bg-zinc-950/80"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">{plan.name}</h2>
                {isFeatured ? (
                  <span className="rounded-full bg-emerald-400 px-3 py-1 text-xs font-bold text-black">
                    Popular
                  </span>
                ) : null}
              </div>
              <p className="mt-4 text-4xl font-black tracking-tight">
                {plan.priceLabel}
              </p>
              <p className="mt-4 min-h-12 text-sm leading-6 text-zinc-400">
                {plan.description}
              </p>
              <div className="mt-5 grid gap-2 text-sm text-zinc-300">
                <p className="rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                  Watchlist: {formatWatchlistLimit(plan.watchlistLimit)}
                </p>
                <p className="rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                  Alertas: {plan.alertsEnabled ? "incluidas" : "no incluidas"}
                </p>
                <p className="rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                  Filtros:{" "}
                  {plan.advancedFiltersEnabled ? "avanzados" : "basicos"}
                </p>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-zinc-300">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              {isCurrent ? (
                <button className="mt-8 w-full rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 font-semibold text-emerald-200">
                  Plan actual
                </button>
              ) : plan.id === "FREE" ? (
                <button className="mt-8 w-full rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 font-semibold text-emerald-200">
                  Empezar gratis
                </button>
              ) : !user ? (
                <Link
                  href="/login"
                  className="mt-8 block w-full rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-center font-semibold text-emerald-200"
                >
                  Iniciar sesion
                </Link>
              ) : (
                <CheckoutButton plan={plan.id as "PRO" | "ELITE"}>
                  Suscribirse
                </CheckoutButton>
              )}
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
