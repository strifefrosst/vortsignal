import AppShell from "@/components/AppShell";
import LogoutButton from "@/components/LogoutButton";
import { getAdminSession } from "@/lib/auth/admin";
import { plans } from "@/lib/plans/config";
import { redirect } from "next/navigation";

type AdminPlansPageProps = {
  searchParams: Promise<{
    status?: string | string[];
    email?: string | string[];
    plan?: string | string[];
  }>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getMessage(status: string | undefined, email: string | undefined) {
  if (status === "updated") {
    return {
      tone: "success",
      title: "Plan actualizado",
      body: email
        ? `El plan de ${email} se ha guardado correctamente.`
        : "El plan se ha guardado correctamente.",
    };
  }

  if (status === "not-found") {
    return {
      tone: "error",
      title: "Usuario no encontrado",
      body: "No existe un usuario de Supabase Auth con ese email.",
    };
  }

  if (status === "invalid") {
    return {
      tone: "error",
      title: "Datos invalidos",
      body: "Indica un email valido y un plan FREE, PRO o ELITE.",
    };
  }

  if (status === "error") {
    return {
      tone: "error",
      title: "No se pudo actualizar",
      body: "La operacion no se completo. Revisa la configuracion segura de Supabase.",
    };
  }

  return null;
}

function AccessDenied({ email }: { email?: string }) {
  return (
    <AppShell
      eyebrow="ADMIN"
      title="Acceso denegado al panel de planes."
      description="Solo los correos autorizados en ADMIN_EMAILS pueden modificar planes manualmente."
    >
      <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.08] p-8 shadow-2xl shadow-black/30">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-300">
          Permisos insuficientes
        </p>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">
          No tienes acceso de administrador.
        </h2>
        {email ? (
          <p className="mt-5 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-zinc-300">
            Sesion actual: {email}
          </p>
        ) : null}
        <div className="mt-6">
          <LogoutButton />
        </div>
      </div>
    </AppShell>
  );
}

export default async function AdminPlansPage({
  searchParams,
}: AdminPlansPageProps) {
  const { user, isAdmin } = await getAdminSession();

  if (!user) {
    redirect("/login");
  }

  if (!isAdmin) {
    return <AccessDenied email={user.email} />;
  }

  const params = await searchParams;
  const email = firstParam(params.email);
  const selectedPlan = firstParam(params.plan) ?? "PRO";
  const message = getMessage(firstParam(params.status), email);
  const planList = [plans.FREE, plans.PRO, plans.ELITE];

  return (
    <AppShell
      eyebrow="ADMIN"
      title="Cambio manual de planes."
      description="Herramienta temporal para pruebas antes de integrar Stripe."
    >
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-white/10 bg-zinc-950/80 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
            Administrador conectado
          </p>
          <p className="mt-1 text-sm text-zinc-300">{user.email}</p>
        </div>
        <LogoutButton />
      </div>

      {message ? (
        <div
          className={`mb-6 rounded-2xl border p-5 shadow-2xl shadow-black/30 ${
            message.tone === "success"
              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
              : "border-red-400/20 bg-red-400/10 text-red-100"
          }`}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.22em]">
            {message.title}
          </p>
          <p className="mt-2 text-sm leading-6 opacity-85">{message.body}</p>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <form
          action="/api/admin/plans/update"
          method="post"
          className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-6 shadow-2xl shadow-black/30"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
            Asignacion manual
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">
            Actualizar plan por email
          </h2>

          <label className="mt-6 grid gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Email del usuario
            <input
              name="email"
              type="email"
              required
              defaultValue={email ?? ""}
              className="h-12 rounded-xl border border-white/10 bg-black px-4 text-sm font-medium text-zinc-100 outline-none ring-emerald-400/20 transition focus:border-emerald-400/50 focus:ring-4"
              placeholder="usuario@dominio.com"
            />
          </label>

          <label className="mt-4 grid gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Plan
            <select
              name="plan"
              defaultValue={selectedPlan}
              className="h-12 rounded-xl border border-white/10 bg-black px-4 text-sm font-medium text-zinc-100 outline-none ring-emerald-400/20 transition focus:border-emerald-400/50 focus:ring-4"
            >
              {planList.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} - {plan.priceLabel}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-emerald-400 px-4 py-3 text-sm font-bold text-black transition hover:bg-emerald-300"
          >
            Guardar plan
          </button>
        </form>

        <aside className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/30">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
            Planes disponibles
          </p>
          <div className="mt-5 grid gap-3">
            {planList.map((plan) => (
              <div
                key={plan.id}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-bold text-white">{plan.name}</p>
                  <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-bold text-zinc-300">
                    {plan.badgeLabel}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {plan.description}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
