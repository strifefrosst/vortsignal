import AppShell from "@/components/AppShell";
import GenerateSignalsButton from "@/components/GenerateSignalsButton";
import LogoutButton from "@/components/LogoutButton";
import { getAdminSession } from "@/lib/auth/admin";
import { redirect } from "next/navigation";

function AccessDenied({ email }: { email?: string }) {
  return (
    <AppShell
      eyebrow="Admin"
      title="Acceso denegado al generador privado."
      description="Tu sesion es valida, pero este panel solo esta disponible para emails autorizados por el equipo de VortSignal."
    >
      <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.08] p-8 shadow-2xl shadow-black/30">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-300">
          Permisos insuficientes
        </p>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">
          No tienes acceso de administrador.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-red-100/80">
          La cuenta conectada no esta incluida en la lista privada de
          administradores.
        </p>
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

export default async function AdminSignalsPage() {
  const { user, isAdmin } = await getAdminSession();

  if (!user) {
    redirect("/login");
  }

  if (!isAdmin) {
    return <AccessDenied email={user.email} />;
  }

  return (
    <AppShell
      eyebrow="Admin Signals"
      title="Generacion manual de senales con control privado."
      description="Panel interno para disparar el motor de scoring desde la interfaz sin enviar secretos al navegador."
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

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <GenerateSignalsButton />

        <aside className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/30">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
            Seguridad
          </p>
          <h2 className="mt-3 text-2xl font-bold">Servidor primero</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            El panel valida la sesion y el email admin en el servidor. La ruta
            publica para cron externo conserva su proteccion por Bearer token.
          </p>
          <div className="mt-6 grid gap-3 text-sm text-zinc-300">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              Supabase Auth confirma la identidad.
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              ADMIN_EMAILS decide el acceso admin.
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              El secret de generacion no viaja al frontend.
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
