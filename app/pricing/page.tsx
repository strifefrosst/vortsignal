import AppShell from "@/components/AppShell";

const plans = [
  {
    name: "Gratis",
    price: "0 EUR",
    description: "Para validar el radar y revisar señales limitadas.",
    features: ["3 señales semanales", "Score básico", "Lista limitada"],
  },
  {
    name: "Pro",
    price: "29 EUR",
    description: "Para traders que quieren seguimiento diario y contexto.",
    features: ["Señales diarias", "Score avanzado", "Alertas prioritarias"],
    featured: true,
  },
  {
    name: "Elite",
    price: "99 EUR",
    description: "Para equipos pequeños y operativa más intensiva.",
    features: ["Cobertura ampliada", "Riesgo por setup", "Soporte preferente"],
  },
];

export default function PricingPage() {
  return (
    <AppShell
      eyebrow="PLANES"
      title="Planes simples para crecer de radar a operativa."
      description="Planes orientativos, sin pagos activos todavía."
    >
      <div className="grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl border p-6 shadow-2xl shadow-black/30 ${
              plan.featured
                ? "border-emerald-400/40 bg-emerald-400/[0.08]"
                : "border-white/10 bg-zinc-950/80"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold">{plan.name}</h2>
              {plan.featured ? (
                <span className="rounded-full bg-emerald-400 px-3 py-1 text-xs font-bold text-black">
                  Popular
                </span>
              ) : null}
            </div>
            <p className="mt-4 text-4xl font-black tracking-tight">
              {plan.price}
              <span className="text-sm font-medium text-zinc-500"> / mes</span>
            </p>
            <p className="mt-4 min-h-12 text-sm leading-6 text-zinc-400">
              {plan.description}
            </p>
            <ul className="mt-6 space-y-3 text-sm text-zinc-300">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                  {feature}
                </li>
              ))}
            </ul>
            <button className="mt-8 w-full rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 font-semibold text-emerald-200">
              Elegir plan
            </button>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
