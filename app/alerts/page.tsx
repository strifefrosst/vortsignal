import AlertSettingsForm, {
  type AlertSettingsView,
} from "@/components/AlertSettingsForm";
import AppShell from "@/components/AppShell";
import NotificationsList, {
  type NotificationView,
} from "@/components/NotificationsList";
import PageHelp from "@/components/PageHelp";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type AlertSettingsRow = {
  enabled: boolean | null;
  watchlist_only: boolean | null;
  min_score: number | null;
  signal_types: string[] | null;
  risk_levels: string[] | null;
};

type NotificationRow = {
  id: string;
  symbol: string | null;
  title: string | null;
  body: string | null;
  read_at: string | null;
  created_at: string | null;
};

const defaultSettings: AlertSettingsView = {
  enabled: true,
  watchlistOnly: true,
  minScore: 70,
  signalTypes: ["LONG", "SHORT"],
  riskLevels: ["LOW", "MEDIUM"],
};

function normalizeSettings(
  settings: AlertSettingsRow | null,
): AlertSettingsView {
  if (!settings) {
    return defaultSettings;
  }

  return {
    enabled: settings.enabled ?? defaultSettings.enabled,
    watchlistOnly: settings.watchlist_only ?? defaultSettings.watchlistOnly,
    minScore: settings.min_score ?? defaultSettings.minScore,
    signalTypes:
      settings.signal_types && settings.signal_types.length > 0
        ? settings.signal_types
        : defaultSettings.signalTypes,
    riskLevels:
      settings.risk_levels && settings.risk_levels.length > 0
        ? settings.risk_levels
        : defaultSettings.riskLevels,
  };
}

function mapNotification(notification: NotificationRow): NotificationView {
  return {
    id: notification.id,
    symbol: notification.symbol,
    title: notification.title,
    body: notification.body,
    readAt: notification.read_at,
    createdAt: notification.created_at,
  };
}

export default async function AlertsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [settingsResult, notificationsResult] = await Promise.all([
    supabase
      .from("user_alert_settings")
      .select("enabled, watchlist_only, min_score, signal_types, risk_levels")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("user_notifications")
      .select("id, symbol, title, body, read_at, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const settings = normalizeSettings(
    (settingsResult.data ?? null) as AlertSettingsRow | null,
  );
  const notifications = ((notificationsResult.data ?? []) as NotificationRow[]).map(
    mapNotification,
  );
  const hasReadError = settingsResult.error || notificationsResult.error;

  return (
    <AppShell
      eyebrow="ALERTAS"
      title="Alertas internas para seguir tus señales relevantes."
      description="Configura qué lecturas quieres destacar y revisa las notificaciones generadas para tu cuenta."
    >
      {hasReadError ? (
        <div className="mb-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-5 text-amber-100 shadow-2xl shadow-black/30">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
            Lectura parcial
          </p>
          <p className="mt-2 text-sm leading-6 text-amber-100/80">
            No se pudo cargar toda la información de alertas. Se muestran los
            datos disponibles sin exponer detalles sensibles.
          </p>
        </div>
      ) : null}

      <PageHelp
        title="Configura tus alertas"
        description="Las alertas internas te notifican cuando hay nuevas señales que cumplen tus criterios. No automatizan operaciones, solo notifican."
        items={[
          { label: "Habilitadas", description: "Activa/desactiva todas las alertas" },
          { label: "Score mínimo", description: "Solo notificar si score >= este valor" },
          { label: "Tipos de señal", description: "Cuáles quieres: LONG, SHORT, WAIT" },
          { label: "Riesgo permitido", description: "LOW, MEDIUM, HIGH" },
          { label: "Solo watchlist", description: "Notificaciones solo de tus activos vigilados" },
        ]}
        variant="compact"
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <AlertSettingsForm settings={settings} />
        <NotificationsList notifications={notifications} />
      </div>
    </AppShell>
  );
}
