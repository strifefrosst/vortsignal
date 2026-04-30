import AppShell from "@/components/AppShell";

export const metadata = {
  title: "Contacto | VortSignal",
  description: "Contacta con el equipo de VortSignal - Soporte, facturación y privacidad",
};

export default function ContactPage() {
  return (
    <AppShell
      eyebrow="CONTACTO"
      title="Contacto"
      description="Estamos aquí para ayudarte."
    >
      <div className="prose prose-invert max-w-none">
        <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/30">
          <div className="space-y-6 text-sm text-zinc-300">
            <p>
              ¿Tienes preguntas? Estamos aquí para ayudarte. Elige el motivo de 
              contacto más adecuado a tu consulta.
            </p>

            <h2 className="text-xl font-bold text-white mb-4 mt-8">
              Canales de contacto
            </h2>
            
            <div className="grid gap-4 mt-6">
              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <h3 className="text-lg font-semibold text-emerald-400">
                  📧 Email de soporte
                </h3>
                <p className="mt-2 text-zinc-400">
                  [EMAIL DE CONTACTO]
                </p>
                <p className="mt-2 text-xs text-zinc-500">
                  Para todas las consultas. Respondemos en 24-48 horas.
                </p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-white mb-4 mt-8">
              Motivos de contacto
            </h2>

            <div className="space-y-4 mt-4">
              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <h3 className="text-lg font-semibold text-white">
                  🛠️ Soporte técnico
                </h3>
                <p className="mt-2 text-zinc-400">
                  Problemas con la plataforma, errores, dificultades de uso.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <h3 className="text-lg font-semibold text-white">
                  💳 Facturación y pagos
                </h3>
                <p className="mt-2 text-zinc-400">
                  Consultas sobre tu suscripción, facturas, métodos de pago.
                </p>
                <p className="mt-2 text-xs text-zinc-500">
                  La gestión de pagos se realiza a través de Stripe. 
                  Accede a tu portal desde /account.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <h3 className="text-lg font-semibold text-white">
                  🔒 Privacidad y datos
                </h3>
                <p className="mt-2 text-zinc-400">
                  Solicitudes de acceso, rectificación, supresión de datos.
                </p>
                <p className="mt-2 text-xs text-zinc-500">
                  Consulta nuestra Política de Privacidad en /privacy.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <h3 className="text-lg font-semibold text-white">
                  🐛 Incidencias de seguridad
                </h3>
                <p className="mt-2 text-zinc-400">
                  Reportar vulnerabilidades o problemas de seguridad.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
              <h3 className="text-lg font-semibold text-amber-200">
                ⚠️ Aviso de seguridad
              </h3>
              <p className="mt-2 text-zinc-300">
                <strong>No incluyas</strong> en tus mensajes:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2 text-zinc-400">
                <li>Contraseñas o tokens de acceso</li>
                <li>Números de tarjeta de crédito</li>
                <li>Datos sensibles no relacionados con tu consulta</li>
              </ul>
              <p className="mt-2 text-zinc-400">
                Nuestro equipo nunca te pedirá tu contraseña.
              </p>
            </div>

            <h2 className="text-xl font-bold text-white mb-4 mt-8">
              Tiempo de respuesta
            </h2>
            <p>
              Nuestro objetivo es responder a todas las consultas en un plazo 
              de <strong>24-48 horas</strong> laborables. Para consultas complejas 
              puede que necesitemos más tiempo, pero te mantendremos informado.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}