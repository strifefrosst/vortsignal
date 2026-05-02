import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth/admin";
import AppShell from "@/components/AppShell";

function AccessDenied({ email }: { email?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-400/20">
          <span className="text-3xl">🚫</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Acceso denegado</h1>
        <p className="mt-4 text-sm text-zinc-400">
          Esta página es solo para administradores. Tu email no tiene acceso.
        </p>
        {email ? (
          <p className="mt-5 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-zinc-300">
            Sesión actual: {email}
          </p>
        ) : null}
        <a
          href="/dashboard"
          className="mt-8 inline-block rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-zinc-300 hover:bg-white/10"
        >
          Volver al dashboard
        </a>
      </div>
    </div>
  );
}

const adminTools = [
  {
    href: "/admin/status",
    title: "Estado del sistema",
    description: "Revisar Supabase, Stripe, Binance, cron y señales.",
    icon: "📊",
  },
  {
    href: "/admin/performance",
    title: "Rendimiento",
    description: "Revisar resultados posteriores de señales expiradas.",
    icon: "📈",
  },
  {
    href: "/admin/signals",
    title: "Generar señales",
    description: "Lanzar generación manual de señales.",
    icon: "⚡",
  },
  {
    href: "/admin/plans",
    title: "Gestión de planes",
    description: "Cambiar plan de usuarios para pruebas.",
    icon: "💳",
  },
];

export default async function AdminPage() {
  const { user, isAdmin } = await getAdminSession();

  if (!user) {
    redirect("/login");
  }

  if (!isAdmin) {
    return <AccessDenied email={user.email} />;
  }

  return (
    <AppShell
      eyebrow="ADMIN"
      title="Panel interno de VortSignal"
      description="Centro de control para administración y supervisión del sistema."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {adminTools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/30 transition hover:border-emerald-400/40"
          >
            <div className="text-4xl mb-4">{tool.icon}</div>
            <h3 className="text-lg font-semibold text-white group-hover:text-emerald-300 transition">
              {tool.title}
            </h3>
            <p className="mt-2 text-sm text-zinc-400">{tool.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-zinc-950/80 p-6">
        <h3 className="text-lg font-semibold text-white">Información de sesión</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-3">
            <p className="text-xs text-zinc-500">Email</p>
            <p className="mt-1 text-sm text-zinc-300">{user.email}</p>
          </div>
          <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3">
            <p className="text-xs text-amber-500">Rol</p>
            <p className="mt-1 text-sm font-semibold text-amber-300">Administrador</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}