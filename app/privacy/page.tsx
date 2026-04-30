import AppShell from "@/components/AppShell";

export const metadata = {
  title: "Política de Privacidad | VortSignal",
  description: "Política de privacidad de VortSignal - Cómo protegemos tus datos",
};

export default function PrivacyPage() {
  return (
    <AppShell
      eyebrow="LEGAL"
      title="Política de Privacidad"
      description="Cómo recopilamos, usamos y protegemos tus datos."
    >
      <div className="prose prose-invert max-w-none">
        <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/30">
          <div className="space-y-6 text-sm text-zinc-300">
            <p className="text-amber-200">
              <strong>Aviso:</strong> Esta política es una plantilla inicial. 
              Los campos marcados con [ ] deben completarse con los datos reales 
              antes del lanzamiento comercial.
            </p>

            <h2 className="text-xl font-bold text-white mb-4 mt-8">
              1. Responsable del tratamiento
            </h2>
            <p>
              <strong>Responsable:</strong> [NOMBRE LEGAL DEL RESPONSABLE]<br />
              <strong>Email:</strong> [EMAIL DE CONTACTO]<br />
              <strong>Dirección:</strong> [DIRECCIÓN SI APLICA]
            </p>

            <h2 className="text-xl font-bold text-white mb-4 mt-8">
              2. Datos que recopilamos
            </h2>
            
            <h3 className="text-lg font-semibold text-emerald-400 mt-6">
              2.1 Datos de cuenta
            </h3>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Email de usuario (proporcionado por Supabase Auth)</li>
              <li>Identificador único de usuario (user ID)</li>
              <li>Fecha de creación de cuenta</li>
              <li>Última fecha de acceso</li>
            </ul>

            <h3 className="text-lg font-semibold text-emerald-400 mt-6">
              2.2 Datos de uso
            </h3>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Watchlist personalizada (símbolos seleccionados)</li>
              <li>Configuración de alertas</li>
              <li>Plan de suscripción actual</li>
              <li>Historial de notificaciones enviadas</li>
            </ul>

            <h3 className="text-lg font-semibold text-emerald-400 mt-6">
              2.3 Datos de pago
            </h3>
            <p className="mt-4">
              Los pagos se procesan a través de <strong>Stripe</strong>. No almacenamos 
              datos de tarjeta de crédito ni información de pago sensible en nuestros 
              sistemas. Solo almacenamos:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>ID de cliente de Stripe (stripe_customer_id)</li>
              <li>ID de suscripción de Stripe (stripe_subscription_id)</li>
              <li>Estado de la suscripción</li>
            </ul>

            <h3 className="text-lg font-semibold text-emerald-400 mt-6">
              2.4 Datos técnicos
            </h3>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Dirección IP (logs básicos del servidor)</li>
              <li>Tipo de navegador y dispositivo</li>
              <li>Cookies de sesión necesarias para el funcionamiento</li>
            </ul>

            <h2 className="text-xl font-bold text-white mb-4 mt-8">
              3. Finalidad del tratamiento
            </h2>
            <p>Usamos tus datos para:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Proporcionar el servicio SaaS de señales crypto</li>
              <li>Gestionar tu cuenta y autenticación</li>
              <li>Procesar suscripciones y pagos</li>
              <li>Enviar alertas y notificaciones solicitadas</li>
              <li>Mantener y mejorar la plataforma</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>

            <h2 className="text-xl font-bold text-white mb-4 mt-8">
              4. Base legal
            </h2>
            <p>El tratamiento de datos se basa en:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Ejecución del contrato:</strong> Para proporcionar el servicio contratado</li>
              <li><strong>Consentimiento:</strong> Para enviar notificaciones y alertas</li>
              <li><strong>Interés legítimo:</strong> Para mejorar el servicio y seguridad</li>
            </ul>

            <h2 className="text-xl font-bold text-white mb-4 mt-8">
              5. Destinatarios
            </h2>
            <p>Tus datos pueden compartirse con:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Supabase</strong> - Autenticación y base de datos</li>
              <li><strong>Stripe</strong> - Procesamiento de pagos</li>
              <li><strong>Vercel</strong> - Hosting de la aplicación</li>
            </ul>
            <p className="mt-4">
              No vendemos ni alquilamos tus datos personales a terceros.
            </p>

            <h2 className="text-xl font-bold text-white mb-4 mt-8">
              6. Transferencias internacionales
            </h2>
            <p>
              Algunos proveedores (Supabase, Stripe, Vercel) pueden procesar datos 
              en servidores fuera del Espacio Económico Europeo. Estas transferencias 
              están sujetas a garantías adecuadas según la normativa vigente.
            </p>

            <h2 className="text-xl font-bold text-white mb-4 mt-8">
              7. Retención de datos
            </h2>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Datos de cuenta:</strong> Mientras la cuenta esté activa</li>
              <li><strong>Datos de uso:</strong> Hasta 2 años después de cerrar la cuenta</li>
              <li><strong>Logs técnicos:</strong> Hasta 12 meses</li>
              <li><strong>Datos de facturación:</strong> Según requisitos legales (6 años)</li>
            </ul>

            <h2 className="text-xl font-bold text-white mb-4 mt-8">
              8. Tus derechos
            </h2>
            <p>Tienes derecho a:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Acceso:</strong> Consultar qué datos tenemos tuyos</li>
              <li><strong>Rectificación:</strong> Corregir datos inexactos</li>
              <li><strong>Supresión:</strong> Solicitar eliminación de tus datos</li>
              <li><strong>Portabilidad:</strong> Recibir tus datos en formato estructurado</li>
              <li><strong>Oposición:</strong> Opponerte a ciertos tratamientos</li>
              <li><strong>Limitación:</strong> Restringir el tratamiento de tus datos</li>
            </ul>

            <h2 className="text-xl font-bold text-white mb-4 mt-8">
              9. Contacto para ejercer derechos
            </h2>
            <p>
              Para ejercer tus derechos o realizar consultas sobre privacidad:<br />
              <strong>Email:</strong> [EMAIL DE CONTACTO]<br />
              <strong>Web:</strong> /contact
            </p>
            <p className="mt-4">
              Respondemos a las solicitudes en un plazo máximo de 30 días.
            </p>

            <h2 className="text-xl font-bold text-white mb-4 mt-8">
              10. Seguridad
            </h2>
            <p>
              Implementamos medidas técnicas y organizativas apropiadas para proteger 
              tus datos: conexión HTTPS, autenticación segura via Supabase Auth, 
              acceso restringido a datos sensibles.
            </p>

            <h2 className="text-xl font-bold text-white mb-4 mt-8">
              11. Cambios en esta política
            </h2>
            <p>
              Podemos actualizar esta política periódicamente. Notificaremos cambios 
              significativos a través de la plataforma o por email.
            </p>

            <p className="mt-8 text-zinc-500">
              Última actualización: [FECHA]
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}