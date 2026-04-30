import AppShell from "@/components/AppShell";

export const metadata = {
  title: "Términos y Condiciones | VortSignal",
  description: "Términos y condiciones de uso de VortSignal - Señales crypto con análisis técnico",
};

export default function TermsPage() {
  return (
    <AppShell
      eyebrow="LEGAL"
      title="Términos y Condiciones"
      description="Condiciones de uso del servicio VortSignal."
    >
      <div className="prose prose-invert max-w-none">
        <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/30">
          <div className="space-y-6 text-sm text-zinc-300">
            <p className="text-amber-200">
              <strong>Aviso importante:</strong> Estos términos son una plantilla 
              inicial y deben ser revisados por un profesional legal antes del 
              lanzamiento comercial definitivo de la plataforma.
            </p>

            <h2 className="text-xl font-bold text-white mb-4 mt-8">
              1. Aceptación de términos
            </h2>
            <p>
              Al acceder y utilizar VortSignal, aceptas estar vinculado por estos 
              Términos y Condiciones. Si no estás de acuerdo con alguna parte de 
              estos términos, no debes utilizar la plataforma.
            </p>

            <h2 className="text-xl font-bold text-white mb-4 mt-8">
              2. Descripción del servicio
            </h2>
            <p>
              VortSignal es una plataforma SaaS que proporciona señales crypto, 
              análisis técnico, métricas de riesgo y herramientas de monitoreo de 
              mercado. El servicio incluye:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Señales basadas en indicadores técnicos</li>
              <li>Scores de análisis técnico</li>
              <li>Métricas de riesgo</li>
              <li>Watchlist personalizada</li>
              <li>Sistema de alertas</li>
              <li>Dashboard de mercado</li>
            </ul>

            <h2 className="text-xl font-bold text-white mb-4 mt-8">
              3. Uso permitido
            </h2>
            <p>Puedes utilizar VortSignal para:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Acceder a señales y análisis de mercado</li>
              <li>Crear y gestionar tu watchlist personal</li>
              <li>Configurar alertas de mercado</li>
              <li>Consultar métricas y scores técnicos</li>
              <li>Gestionar tu cuenta y suscripción</li>
            </ul>

            <h2 className="text-xl font-bold text-white mb-4 mt-8">
              4. Uso no permitido
            </h2>
            <p>Está prohibido:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Utilizar el servicio para asesoramiento financiero</li>
              <li>Redistribuir las señales como si fueran recomendaciones propias</li>
              <li>Realizar scraping o extracción masiva de datos</li>
              <li>Intentar vulnerar la seguridad de la plataforma</li>
              <li>Utilizar la plataforma para actividades ilegales</li>
              <li>Crear cuentas falsas o fraudulentas</li>
            </ul>

            <h2 className="text-xl font-bold text-white mb-4 mt-8">
              5. Planes y suscripciones
            </h2>
            <p>
              VortSignal ofrece diferentes planes de suscripción. Los planes y sus 
              precios están definidos en la página de precios. Las suscripciones se 
              gestionan a través de Stripe y están sujetas a los términos de Stripe.
            </p>
            <p className="mt-4">
              Puedes cancelar tu suscripción en cualquier momento desde el 
              <span className="text-emerald-400"> portal de Stripe</span>. Al cancelar, 
              perderás el acceso a las funcionalidades del plan de pago al final del 
              período de facturación actual.
            </p>

            <h2 className="text-xl font-bold text-white mb-4 mt-8">
              6. Limitación de responsabilidad
            </h2>
            <p>
              VortSignal se proporciona "tal cual" sin garantías de ningún tipo. 
              No garantizamos que el servicio sea ininterrumpido, seguro o libre de errores.
            </p>
            <p className="mt-4">
              En la medida máxima permitida por la ley, VortSignal no será responsable 
              de ninguna pérdida直接或间接损失, incluyendo但不限于:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Pérdidas financieras derivadas del uso de las señales</li>
              <li>Pérdidas por decisiones de inversión basadas en la información proporcionada</li>
              <li>Pérdidas por interrupciones del servicio</li>
              <li>Pérdidas de datos o ganancias</li>
            </ul>

            <h2 className="text-xl font-bold text-white mb-4 mt-8">
              7. Disponibilidad del servicio
            </h2>
            <p>
              Nos esforzamos por mantener la plataforma disponible, pero no garantizamos 
              disponibilidad continua. El servicio puede experimentar interrupciones por 
              mantenimiento, actualizaciones o problemas técnicos.
            </p>

            <h2 className="text-xl font-bold text-white mb-4 mt-8">
              8. Cambios en el servicio
            </h2>
            <p>
              Nos reservamos el derecho de modificar, suspender o discontinuar cualquier 
              parte del servicio en cualquier momento. Podemos actualizar estos términos 
              periódicamente. El uso continuado de la plataforma tras los cambios constituye 
              aceptación de los nuevos términos.
            </p>

            <h2 className="text-xl font-bold text-white mb-4 mt-8">
              9. Propiedad intelectual
            </h2>
            <p>
              Todo el contenido, código, diseño y propiedad intelectual de VortSignal 
              pertenece a [NOMBRE LEGAL DEL RESPONSABLE]. No se permite la reproducción 
              o distribución sin autorización expresa.
            </p>

            <h2 className="text-xl font-bold text-white mb-4 mt-8">
              10. Contacto
            </h2>
            <p>
              Para preguntas sobre estos términos, contacta a través de la página 
              de contacto.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}