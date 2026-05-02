import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/auth/admin";
import { getUserPlan } from "@/lib/plans/server";
import LogoutButton from "@/components/LogoutButton";
import UserStatusBadge from "@/components/UserStatusBadge";

const publicNavigation = [
  { href: "/market", label: "Mercado" },
  { href: "/signals", label: "Señales" },
  { href: "/learn", label: "Guía" },
  { href: "/pricing", label: "Planes" },
];

const privateNavigation = [
  { href: "/dashboard", label: "Panel" },
  { href: "/signals", label: "Señales" },
  { href: "/watchlist", label: "Mi lista" },
  { href: "/alerts", label: "Alertas" },
  { href: "/market", label: "Mercado" },
  { href: "/learn", label: "Guía" },
  { href: "/pricing", label: "Planes" },
  { href: "/account", label: "Cuenta" },
];

export default async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdmin = user ? isAdminEmail(user.email) : false;
  const userPlan = user ? await getUserPlan(user.id) : null;
  const planId = userPlan?.plan.id as "FREE" | "PRO" | "ELITE" | undefined;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-400/40 bg-emerald-400/10 text-sm font-black text-emerald-300">
            VS
          </span>
          <span className="text-base font-semibold tracking-tight text-white">
            VortSignal
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-zinc-400 md:flex">
          {(user ? privateNavigation : publicNavigation).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-emerald-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user && (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-300 transition hover:bg-amber-400/20"
                >
                  Admin
                </Link>
              )}
              {planId && (
                <UserStatusBadge role={isAdmin ? "admin" : "user"} plan={planId} />
              )}
              <LogoutButton />
            </>
          )}
          {!user && (
            <Link
              href="/login"
              className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400 hover:text-black"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
