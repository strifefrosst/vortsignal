# ROADMAP.md — Hoja de ruta estratégica de VortSignal

> Este documento define la evolución prevista de VortSignal.  
> Debe usarse como guía por agentes IA para priorizar tareas sin perder coherencia de producto.

---

## Principio rector

VortSignal debe evolucionar de:

```txt
SaaS de señales crypto
```

a:

```txt
plataforma inteligente de análisis, vigilancia, educación, portfolio y herramientas de mercado
```

sin cruzar de forma irresponsable la línea del asesoramiento financiero personalizado.

El producto debe crecer con tres pilares:

1. **Utilidad real.**
2. **Claridad para usuarios principiantes y avanzados.**
3. **Seguridad legal, técnica y operativa.**

---

# Fase 1 — Producto base

**Estado:** actual / en consolidación.

## Objetivo

Tener un SaaS funcional que permita al usuario ver señales, entenderlas, guardar activos vigilados, recibir alertas y pagar por planes.

## Funcionalidades

- Landing.
- Auth.
- Dashboard.
- Señales reales.
- Filtros de señales.
- Watchlist.
- Alertas internas.
- Mercado.
- Planes Free / Pro / Elite.
- Stripe Checkout.
- Customer Portal.
- Panel admin.
- Admin status.
- Performance inicial.
- Páginas legales.
- Roadmap.
- Learn.

## Valor para usuario

Permite empezar a usar VortSignal como herramienta de vigilancia y lectura técnica de mercado.

## Pendiente de pulido

- Portfolio manual.
- Portfolio ↔ Watchlist.
- UX avanzada de señales.
- Mejoras responsive.
- Leyendas y tutoriales más profundos.

---

# Fase 2 — Educación y usabilidad

**Estado:** actual / próximo.

## Objetivo

Hacer que cualquier usuario entienda lo que ve.

## Funcionalidades

- Guía rápida.
- Tutorial principiante.
- Tutorial avanzado.
- Glosario.
- PageHelp por sección.
- Leyendas visibles.
- Onboarding guiado.
- Estados vacíos bien diseñados.
- Explicaciones de score, riesgo, RSI, volumen, tendencia, LONG, SHORT, WAIT.
- Modo “no sé de trading”.
- Modo “usuario avanzado”.

## Valor para usuario

Reduce confusión, evita malinterpretaciones y aumenta confianza.

## Regla UX

Cada pantalla debe responder:

1. Qué es esta página.
2. Qué significan sus datos.
3. Qué puedo hacer aquí.
4. Qué no debo asumir.

---

# Fase 3 — Backend avanzado de administración

**Estado:** futuro próximo.

## Objetivo

Construir un backend interno serio, preparado para gestión con equipo humano.

## Funcionalidades

### Gestión interna

- Gestión de usuarios.
- Gestión de planes.
- Gestión de suscripciones.
- Gestión de roles.
- Roles: admin, analyst, support, moderator.
- Bloqueo/desbloqueo de usuarios.
- Revisión de actividad.

### Operaciones

- Panel de estado interno.
- Monitor de Supabase.
- Monitor de Stripe.
- Monitor de Binance.
- Monitor de cron.
- Monitor de webhooks.
- Logs de errores.
- Logs de tareas.
- Historial de generación de señales.

### Equipo humano

- Panel para analistas.
- Panel para soporte.
- Revisión manual de señales.
- Moderación de contenido futuro.
- Notas internas.
- Auditoría de cambios.

### Métricas de negocio

- Usuarios por plan.
- Conversiones.
- Retención.
- Actividad.
- Uso de señales.
- Uso de watchlist.
- Uso de alertas.
- Uso de portfolio.
- Errores de pago.
- Webhooks fallidos.

## Valor para negocio

Permite pasar de prototipo individual a SaaS gestionable por un equipo.

---

# Fase 4 — Noticias de mercado

**Estado:** futuro.

## Objetivo

Añadir contexto informativo a las señales y portfolio.

## Funcionalidades

- Sección de noticias de mercado.
- Agregación RSS/APIs.
- Scraping solo si es legal y permitido por términos de la fuente.
- Clasificación por activo.
- Clasificación por sector.
- Clasificación por impacto.
- Sentimiento estimado.
- Resumen con IA.
- Enlace a fuente original.
- Detección de noticias relevantes para watchlist.
- Detección de noticias relevantes para portfolio.
- Alertas por evento importante.
- Panel admin para revisar fuentes.

## Reglas de scraping

- Priorizar APIs oficiales.
- Priorizar RSS.
- Respetar robots.txt y términos.
- No copiar artículos completos.
- Mostrar fuente.
- Resumir con atribución.
- Evitar contenido protegido.

## Valor para usuario

Permite conectar señales técnicas con eventos reales de mercado.

---

# Fase 5 — Marketplace de bots y herramientas

**Estado:** futuro avanzado.

## Objetivo

Convertir VortSignal en plataforma de herramientas, scripts, bots e indicadores.

## Funcionalidades

- Marketplace de bots.
- Bots para TradingView.
- Plantillas de estrategias.
- Scripts de análisis.
- Indicadores personalizados.
- Herramientas para Binance u otras plataformas compatibles.
- Marketplace de analistas/herramientas.
- Sistema de valoraciones.
- Reviews.
- Control de calidad.
- Versionado.
- Disclaimers de riesgo.
- Separación entre:
  - herramientas educativas,
  - señales,
  - automatización,
  - ejecución real.

## Regla de seguridad

No activar operativa automática con dinero real hasta tener:

- permisos claros,
- disclaimers,
- logs,
- límites,
- control de riesgo,
- aceptación explícita del usuario,
- revisión legal.

## Valor para usuario

Convierte VortSignal en ecosistema, no solo en dashboard.

---

# Fase 6 — Portfolio y seguimiento de activos

**Estado:** inicio actual.

## Objetivo

Permitir que el usuario registre y entienda su cartera.

## Funcionalidades

- Portfolio manual.
- Registro de posiciones.
- Tipo de activo: crypto, stock, ETF, fund, other.
- Cantidad.
- Precio medio.
- Plataforma.
- Divisa.
- Notas.
- Valor invertido.
- Valor estimado.
- Rentabilidad estimada.
- Distribución por activo.
- Distribución por tipo.
- Distribución por plataforma.
- Exposición por divisa.
- Historial de movimientos.
- DCA tracker.
- Alertas por sobreexposición.
- Alertas por concentración.
- Simulador de escenarios.

## Integración con Watchlist

- Posición registrada puede añadirse a Watchlist.
- Watchlist puede sugerir añadir posición.
- Señales pueden filtrarse por Portfolio.
- Alertas pueden limitarse a Portfolio.

## Valor para usuario

Transforma VortSignal de lector de mercado a herramienta de seguimiento personal.

---

# Fase 7 — Importación y conexión de portfolios

**Estado:** futuro.

## Objetivo

Reducir fricción al cargar carteras externas.

## Métodos

### Manual

- Formulario.
- CSV.
- Plantillas.

### Captura

- Subir screenshot.
- OCR/IA para extraer activos.
- Confirmación manual antes de guardar.
- Detección de errores.

### APIs

- Revolut si ofrece API oficial adecuada.
- Trade Republic si ofrece API oficial adecuada.
- Binance.
- Brokers compatibles.
- Open banking/integraciones futuras si cumplen normativa.

## Reglas

- No guardar credenciales sensibles.
- Priorizar OAuth/API oficial.
- Modo lectura inicialmente.
- Nunca operar automáticamente al principio.
- Pedir confirmación al usuario antes de guardar datos importados.

## Valor para usuario

Permite analizar portfolio real sin meter datos uno a uno.

---

# Fase 8 — Asistente educativo de cartera

**Estado:** futuro sensible/legal.

## Objetivo

Ayudar al usuario a entender su portfolio mediante análisis educativo.

## Cuestionario inicial

- Experiencia.
- Horizonte temporal.
- Tolerancia al riesgo.
- Objetivo.
- Capital aproximado.
- Preferencias:
  - ETFs,
  - acciones,
  - crypto,
  - dividendos,
  - crecimiento,
  - defensivo,
  - sectores concretos.
- Liquidez deseada.
- Volatilidad aceptada.
- DCA sí/no.
- Necesidad de capital a corto plazo.
- Nivel de implicación.

## Análisis

- Sectores débiles.
- Sectores sobreexpuestos.
- Concentración excesiva.
- Activos duplicados.
- Riesgo por divisa.
- Peso de tecnología.
- Peso de salud.
- Peso de defensa.
- Peso de energía.
- Peso de crypto.
- Peso de emergentes.
- Liquidez.
- Volatilidad estimada.
- Correlaciones.

## Sugerencias permitidas como análisis educativo

- Posibles rebalanceos simulados.
- Escenarios.
- Alertas de concentración.
- Activos a vigilar.
- Zonas de revisión.
- Momentos potenciales para revisar DCA.
- Simulaciones de reducción de exposición.
- Comparativas de riesgo.

## Frases a evitar

- Compra esto.
- Vende esto.
- Apaláncate aquí.
- Es buen momento seguro.
- Rentabilidad garantizada.
- Debes cerrar esta posición.

## Enfoque correcto

- “Podrías revisar…”
- “El sistema detecta concentración…”
- “Una simulación posible sería…”
- “No constituye recomendación personalizada.”
- “Consulta a un asesor autorizado si necesitas asesoramiento.”

---

# Fase 9 — Escalado empresarial

**Estado:** futuro.

## Objetivo

Preparar VortSignal para operar como empresa SaaS seria.

## Funcionalidades

- Multi-equipo.
- Panel de operaciones.
- Soporte interno.
- Analistas humanos.
- QA de señales.
- Auditoría avanzada.
- Control de versiones del motor.
- Control de versiones de modelos IA.
- Logs estructurados.
- Observabilidad.
- Métricas de retención.
- Métricas de conversión.
- Métricas de engagement.
- Gestión de incidencias.
- Gestión de contenido.
- Gestión de fuentes.
- Gestión de marketplace.
- Sistema de tickets.
- SLA interno.

---

# Prioridad recomendada actual

1. Pulir UI Portfolio.
2. Integrar Portfolio ↔ Watchlist.
3. Añadir filtro “Solo mi portfolio” en Señales.
4. Añadir bloque “Señales sobre mis posiciones” en Dashboard.
5. Añadir alertas de portfolio.
6. Mejorar performance/backtesting.
7. Crear movimientos de portfolio.
8. Crear importación CSV.
9. Crear captura/OCR.
10. Crear backend admin avanzado.
11. Crear noticias.
12. Crear marketplace.
13. Crear asistente educativo de cartera.

---

# Criterios de producto

Cada nueva feature debe cumplir:

- útil,
- comprensible,
- segura,
- legalmente prudente,
- con estado vacío,
- con build pasando,
- sin exponer secretos,
- con UI consistente,
- con ruta protegida si contiene datos personales.
