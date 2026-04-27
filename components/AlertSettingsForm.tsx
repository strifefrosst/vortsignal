export type AlertSettingsView = {
  enabled: boolean;
  watchlistOnly: boolean;
  minScore: number;
  signalTypes: string[];
  riskLevels: string[];
};

type AlertSettingsFormProps = {
  settings: AlertSettingsView;
};

const scoreOptions = [60, 70, 80];
const signalTypeOptions = [
  { value: "LONG", label: "LONG" },
  { value: "SHORT", label: "SHORT" },
  { value: "WAIT", label: "WAIT" },
];
const riskOptions = [
  { value: "LOW", label: "Riesgo bajo" },
  { value: "MEDIUM", label: "Riesgo medio" },
  { value: "HIGH", label: "Riesgo alto" },
];

function ToggleField({
  name,
  label,
  description,
  checked,
}: {
  name: string;
  label: string;
  description: string;
  checked: boolean;
}) {
  return (
    <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/40 p-4">
      <input
        type="checkbox"
        name={name}
        value="true"
        defaultChecked={checked}
        className="mt-1 h-4 w-4 rounded border-white/20 bg-zinc-950 accent-emerald-400"
      />
      <span>
        <span className="block text-sm font-semibold text-white">{label}</span>
        <span className="mt-1 block text-sm leading-6 text-zinc-500">
          {description}
        </span>
      </span>
    </label>
  );
}

export default function AlertSettingsForm({
  settings,
}: AlertSettingsFormProps) {
  return (
    <form
      action="/api/alerts/settings"
      method="post"
      className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/30"
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
          Configuración
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">
          Preferencias de alertas
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Ajusta qué lecturas internas quieres destacar en tu centro de mando.
        </p>
      </div>

      <div className="mt-6 grid gap-3">
        <ToggleField
          name="enabled"
          label="Alertas activas"
          description="Permite crear notificaciones internas cuando se generen señales que encajen con tus filtros."
          checked={settings.enabled}
        />
        <ToggleField
          name="watchlist_only"
          label="Solo mi watchlist"
          description="Limita las alertas a los activos que has marcado para vigilar."
          checked={settings.watchlistOnly}
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
          Score mínimo
          <select
            name="min_score"
            defaultValue={settings.minScore}
            className="h-11 rounded-xl border border-white/10 bg-black px-3 text-sm font-medium text-zinc-200 outline-none ring-emerald-400/20 transition focus:border-emerald-400/50 focus:ring-4"
          >
            {scoreOptions.map((score) => (
              <option key={score} value={score}>
                Score {score}+
              </option>
            ))}
          </select>
          <span className="normal-case tracking-normal text-zinc-600">
            Confluencia técnica mínima para avisar.
          </span>
        </label>

        <fieldset className="rounded-xl border border-white/10 bg-black/40 p-4">
          <legend className="px-1 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Tipos
          </legend>
          <div className="mt-3 grid gap-3">
            {signalTypeOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 text-sm font-medium text-zinc-200"
              >
                <input
                  type="checkbox"
                  name="signal_types"
                  value={option.value}
                  defaultChecked={settings.signalTypes.includes(option.value)}
                  className="h-4 w-4 rounded border-white/20 bg-zinc-950 accent-emerald-400"
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="rounded-xl border border-white/10 bg-black/40 p-4">
          <legend className="px-1 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Riesgos
          </legend>
          <div className="mt-3 grid gap-3">
            {riskOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 text-sm font-medium text-zinc-200"
              >
                <input
                  type="checkbox"
                  name="risk_levels"
                  value={option.value}
                  defaultChecked={settings.riskLevels.includes(option.value)}
                  className="h-4 w-4 rounded border-white/20 bg-zinc-950 accent-emerald-400"
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <button
        type="submit"
        className="mt-6 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-emerald-300"
      >
        Guardar configuración
      </button>
    </form>
  );
}
