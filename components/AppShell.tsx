import type { ReactNode } from "react";
import SiteHeader from "./SiteHeader";

type AppShellProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  children: ReactNode;
};

export default function AppShell({
  title,
  eyebrow = "VortSignal",
  description,
  children,
}: AppShellProps) {
  return (
    <main className="min-h-screen bg-black text-white">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        <div className="mb-8 flex flex-col gap-3 border-b border-white/10 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
            {eyebrow}
          </p>
          <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-white md:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="max-w-2xl text-base leading-7 text-zinc-400">
              {description}
            </p>
          ) : null}
        </div>
        {children}
      </section>
    </main>
  );
}
