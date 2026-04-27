import Link from "next/link";

const navigation = [
  { href: "/dashboard", label: "Panel" },
  { href: "/signals", label: "Señales" },
  { href: "/watchlist", label: "Mi lista" },
  { href: "/market", label: "Mercado" },
  { href: "/pricing", label: "Planes" },
];

export default function SiteHeader() {
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
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-emerald-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/login"
          className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400 hover:text-black"
        >
          Entrar
        </Link>
      </div>
    </header>
  );
}
