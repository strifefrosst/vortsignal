import type React from "react";

interface PageHelpItem {
  label: string;
  description: string;
}

interface PageHelpProps {
  title: string;
  description: string;
  items: PageHelpItem[];
  variant?: "default" | "compact";
}

export default function PageHelp({
  title,
  description,
  items,
  variant = "default",
}: PageHelpProps): React.ReactNode {
  if (variant === "compact") {
    return (
      <details className="mb-6 rounded-2xl border border-sky-400/20 bg-sky-400/[0.06] p-4 group">
        <summary className="cursor-pointer text-sm font-semibold text-sky-300 hover:text-sky-200 transition">
          ℹ️ {title}
        </summary>
        <div className="mt-4 space-y-3">
          <p className="text-sm text-sky-100/80">{description}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {items.map((item) => (
              <div key={item.label} className="rounded-lg bg-black/30 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
                  {item.label}
                </p>
                <p className="mt-1 text-xs text-sky-100/70">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </details>
    );
  }

  return (
    <div className="mb-8 rounded-2xl border border-sky-400/20 bg-sky-400/[0.06] p-6">
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">ℹ️</span>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-sky-300">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-sky-100/80">{description}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-sky-400/20 bg-black/20 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
                  {item.label}
                </p>
                <p className="mt-2 text-sm text-sky-100/70">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
