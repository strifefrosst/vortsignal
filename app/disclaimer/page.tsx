import AppShell from "@/components/AppShell";

export const metadata = {
  title: "Disclaimer | VortSignal",
  description: "Aviso legal sobre el uso de VortSignal - Señales crypto con análisis técnico",
};

export default function DisclaimerPage() {
  return (
    <AppShell
      eyebrow="AVISO LEGAL"
      title="Disclaimer financiero"
      description="Información importante sobre el uso de nuestros servicios."
    >
      <div className="prose prose-invert max-w-none">
        <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/30">
          <h2 className="text-xl font-bold text-white mb-4">
            Información importante
          </h2>
          
          <div className="space-y-6 text-sm text-zinc-300">
            <p>
              <strong className="text-zinc-100">VortSignal</strong> es una herramienta 
              informativa y de análisis técnico diseñada para ayudar a los usuarios a 
              monitorear el mercado de criptomonedas. La plataforma proporciona señales 
              basadas en indicadores técnicos, scores de análisis y métricas de riesgo.
            </p>

            <h3 className="text-lg font-semibold text-emerald-400 mt-8">
              No es asesoramiento financiero
            </h3>
            <p>
              VortSignal <strong>no ofrece asesoramiento financiero personalizado</strong>. 
              Las señales, scores técnicos y métricas de riesgo que proporcionamos son 
              exclusivamente <strong>informativas</strong> y no constituyen ninguna 
              recomendación, sugerencia o instrucción para comprar, vender o mantener 
              ningún activo financiero.
            </p>

            <h3 className="text-lg font-semibold text-emerald-400 mt-8">
              Riesgo de pérdida
            </h3>
            <p>
              Operar en mercados financieros y de criptomonedas implica un riesgo 
              significativo de pérdida de capital. Las criptomonedas son activos 
              altamente volátiles y los precios pueden fluctuar drasticamente en 
              períodos cortos. Nunca debes invertir más de lo que puedas permitirte perder.
            </p>

            <h3 className="text-lg font-semibold text-emerald-400 mt-8">
              Rentabilidades pasadas
            </h3>
            <p>
              Las rentabilidades pasadas, los scores técnicos y cualquier métrica 
              histórica <strong>no garantizan resultados futuros</strong>. El mercado 
              de criptomonedas es inherentemente impredecible y puede cambiar 
              drásticamente sin previo aviso.
            </p>

            <h3 className="text-lg font-semibold text-emerald-400 mt-8">
              Responsabilidad del usuario
            </h3>
            <p>
              El usuario es el único responsable de:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Realizar su propio análisis antes de tomar decisiones de inversión</li>
              <li>Evaluar la información proporcionada por VortSignal de forma crítica</li>
              <li>Entender los riesgos asociados al trading de criptomonedas</li>
              <li>Cumplir con las regulaciones locales aplicables en su jurisdicción</li>
            </ul>

            <h3 className="text-lg font-semibold text-emerald-400 mt-8">
              Limitación de responsabilidad
            </h3>
            <p>
              VortSignal no será responsable de ninguna pérdida, daño o perjuicio 
              directo o indirecto que pueda derivarse del uso de la plataforma o 
              de la información proporcionada. El uso de VortSignal es bajo la 
              exclusiva responsabilidad del usuario.
            </p>

            <div className="mt-8 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
              <p className="text-amber-200">
                <strong>Aviso importante:</strong> Esta plataforma es una herramienta 
                de análisis técnico. Siempre debes consultar con profesionales financieros 
                cualificados antes de tomar decisiones de inversión.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}