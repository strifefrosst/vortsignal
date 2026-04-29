import AppShell from "@/components/AppShell";
import BillingPortalButton from "@/components/BillingPortalButton";
import LogoutButton from "@/components/LogoutButton";
import { formatWatchlistLimit } from "@/lib/plans/config";
import { getUserPlan } from "@/lib/plans/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { redirect } from "next/navigation";

function formatPeriodEnd(value: string | null) {
  if (!value) {
    return "Sin fecha de renovacion";
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const userPlan = await getUserPlan(user.id);
  const plan = userPlan.plan;
  const resolvedSearchParams = await searchParams;
  const checkoutStatus = resolvedSearchParams.checkout;

  // Get stripe_customer_id for PRO/ELITE plans
  let stripeCustomerId: string | null = null;
  if (plan.id === "PRO" || plan.id === "ELITE") {
    const adminClient = createAdminClient();
    const { data: planData } = await adminClient
      .from("user_plans")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();
    stripeCustomerId = planData?.stripe_customer_id ?? null;
  }

  const isPaidPlan = plan.id === "PRO" || plan.id === "ELITE";

  return (
    <AppShell
      eyebrow="CUENTA"
      title="Tu plan y limites actuales."
      description="Revisa el acceso disponible para tu cuenta antes de que activemos pagos."
    >
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-6 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                Sesion activa
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">
                {user.email}
              </h2>
            </div>
            <span className="w-fit rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-sm font-black text-emerald-200">
              {plan.badgeLabel}
            </span>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                Plan
              </p>
              <p className="mt-2 text-xl font-bold text-white">{plan.name}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                Estado
              </p>
              <p className="mt-2 text-xl font-bold text-white">
                {userPlan.status}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                Periodo
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {formatPeriodEnd(userPlan.currentPeriodEnd)}
              </p>
            </div>
          </div>

          {checkoutStatus === "success" && (
            <div className="mt-6 rounded-xl border border-emerald-400/40 bg-emerald-400/10 p-4">
              <p className="font-semibold text-emerald-200">
                ✓ Pago completado
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                Tu plan se actualizara en unos segundos. Si no ves los cambios,
                recarga la pagina.
              </p>
            </div>
          )}

          {checkoutStatus === "cancel" && (
            <div className="mt-6 rounded-xl border border-yellow-400/40 bg-yellow-400/10 p-4">
              <p className="font-semibold text-yellow-200">
                Checkout cancelado
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                Puedes intentar de nuevo cuando quieras.
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {isPaidPlan && stripeCustomerId ? (
              <BillingPortalButton>Gestionar suscripcion</BillingPortalButton>
            ) : isPaidPlan ? (
              <span className="rounded-xl border border-yellow-400/20 bg-yellow-400/5 px-4 py-3 text-sm text-yellow-200">
                Contacta soporte para gestionar tu suscripcion
              </span>
            ) : (
              <Link
                href="/pricing"
                className="rounded-xl bg-emerald-400 px-4 py-3 text-sm font-bold text-black transition hover:bg-emerald-300"
              >
                Mejorar plan
              </Link>
            )}
            <Link
              href="/pricing"
              className="rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-white/10"
            >
              Ver planes
            </Link>
            <LogoutButton />
          </div>

          <p className="mt-4 text-xs text-zinc-500">
            La gestion de pagos se realiza de forma segura en Stripe.
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/30">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
            Limites incluidos
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">
            {plan.description}
          </h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                Watchlist
              </p>
              <p className="mt-2 font-semibold text-white">
                {formatWatchlistLimit(plan.watchlistLimit)}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                Alertas
              </p>
              <p className="mt-2 font-semibold text-white">
                {plan.alertsEnabled ? "Activas" : "No incluidas"}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                Filtros
              </p>
              <p className="mt-2 font-semibold text-white">
                {plan.advancedFiltersEnabled ? "Avanzados" : "Basicos"}
              </p>
            </div>
          </div>

          <ul className="mt-6 grid gap-3 text-sm text-zinc-300">
            {plan.features.map((feature) => (
              <li
                key={feature}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
              >
                {feature}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
