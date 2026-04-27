export type NotificationView = {
  id: string;
  symbol: string | null;
  title: string | null;
  body: string | null;
  readAt: string | null;
  createdAt: string | null;
};

type NotificationsListProps = {
  notifications: NotificationView[];
};

function formatDate(value: string | null) {
  if (!value) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(new Date(value))
    .replace(",", " ·");
}

export default function NotificationsList({
  notifications,
}: NotificationsListProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/30">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
          Notificaciones
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">
          Alertas recientes
        </h2>
      </div>

      {notifications.length > 0 ? (
        <div className="mt-5 grid gap-3">
          {notifications.map((notification) => {
            const isRead = Boolean(notification.readAt);

            return (
              <article
                key={notification.id}
                className={`rounded-xl border p-4 ${
                  isRead
                    ? "border-white/10 bg-black/30"
                    : "border-emerald-400/30 bg-emerald-400/[0.08]"
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-xs font-semibold text-zinc-300">
                        {notification.symbol ?? "Sin símbolo"}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          isRead
                            ? "bg-zinc-800 text-zinc-400"
                            : "bg-emerald-400/15 text-emerald-200"
                        }`}
                      >
                        {isRead ? "Leída" : "Nueva"}
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-white">
                      {notification.title ?? "Alerta de mercado"}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      {notification.body ?? "Nueva lectura interna disponible."}
                    </p>
                    <p className="mt-3 font-mono text-xs text-zinc-500">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>

                  {!isRead ? (
                    <form action="/api/alerts/read" method="post">
                      <input
                        type="hidden"
                        name="notification_id"
                        value={notification.id}
                      />
                      <button
                        type="submit"
                        className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:border-emerald-400/40 hover:text-emerald-200"
                      >
                        Marcar leída
                      </button>
                    </form>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-white/10 bg-black/40 p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
            Sin alertas
          </p>
          <h3 className="mt-3 text-2xl font-bold tracking-tight">
            Todavía no hay notificaciones internas.
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-400">
            Cuando una señal generada encaje con tus preferencias, aparecerá
            aquí para que puedas revisarla con calma.
          </p>
        </div>
      )}
    </section>
  );
}
