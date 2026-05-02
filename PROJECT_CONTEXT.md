# PROJECT_CONTEXT.md — VortSignal

> Documento de contexto maestro para agentes IA que trabajen en este repositorio.  
> Objetivo: que cualquier agente entienda el producto, su estado actual, arquitectura, límites y dirección sin tener que reconstruir el contexto desde cero.

---

## 1. Identidad del producto

**Nombre:** VortSignal  
**Tipo:** SaaS de análisis de señales de mercado, inicialmente centrado en crypto.  
**Idioma principal de la UI:** Español.  
**Estética:** Oscura, premium, tecnológica, sobria, estilo SaaS profesional.  
**Promesa de producto:** Reducir ruido de mercado mediante señales técnicas, score, riesgo, watchlist, alertas, portfolio y análisis educativo.

VortSignal **no debe presentarse como asesor financiero**, ni prometer rentabilidad, ni dar órdenes de compra o venta personalizadas.  
Debe posicionarse como:

- herramienta de análisis técnico,
- plataforma de seguimiento,
- sistema educativo,
- simulador/ayudante de interpretación,
- asistente de organización y vigilancia de activos.

---

## 2. Stack técnico actual

- **Framework:** Next.js App Router.
- **Lenguaje:** TypeScript.
- **Estilos:** CSS/Tailwind-like utilities según el patrón actual del proyecto.
- **Backend app:** Route Handlers de Next.js.
- **Auth:** Supabase Auth.
- **Base de datos:** Supabase Postgres.
- **Pagos:** Stripe Checkout + Stripe Webhook + Stripe Customer Portal.
- **Deploy:** Vercel.
- **Control de versiones:** GitHub.
- **Datos mercado:** Binance public market data.
- **Admin:** Control mediante `ADMIN_EMAILS`.
- **Cron:** Vercel Cron en plan Hobby, actualmente ajustado a frecuencia diaria por limitación del plan.

---

## 3. Estado funcional actual

### Implementado

- Landing.
- Login / signup.
- Supabase Auth.
- Dashboard.
- Página de señales.
- Mercado con snapshots públicos.
- Watchlist de usuario.
- Alertas internas.
- Planes Free / Pro / Elite.
- Stripe Checkout.
- Stripe Webhook.
- Stripe Customer Portal.
- Página de cuenta.
- Panel admin.
- Admin status.
- Admin señales.
- Admin planes.
- Performance/backtesting inicial.
- Roadmap.
- Learn/Guía.
- Páginas legales/disclaimer/privacy/terms/contact.
- Robots y sitemap.
- Portfolio manual básico en desarrollo/pulido.
- PageHelp/leyendas visibles en páginas principales.

### En progreso / a pulir

- UI de Portfolio.
- Integración Portfolio ↔ Watchlist.
- Señales sobre posiciones reales.
- Alertas basadas en portfolio.
- Métricas de rendimiento más completas.
- Backend admin más potente.
- Noticias de mercado.
- Marketplace de bots/herramientas.
- Importación de portfolio por CSV/captura/API.
- Asistente educativo de cartera.

---

## 4. Reglas de trabajo para agentes IA

Antes de tocar cualquier archivo, el agente debe ejecutar:

```powershell
pwd
git status
```

Debe confirmar que está en:

```txt
C:\Users\eMeir\vortsignal
```

Si el working tree no está limpio, debe **detenerse** y mostrar los archivos pendientes.

No debe modificar archivos fuera del alcance de la tarea.  
No debe reescribir arquitectura sin pedirlo.  
No debe tocar Stripe, Auth, scoring, cron o generación de señales salvo que la tarea lo pida explícitamente.

---

## 5. Variables de entorno

Nunca imprimir valores. Solo comprobar existencia.

Variables relevantes:

```env
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SECRET_KEY

ADMIN_EMAILS
SIGNALS_GENERATE_SECRET
CRON_SECRET

STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_APP_URL
STRIPE_PRO_PRICE_ID
STRIPE_ELITE_PRICE_ID
```

Regla crítica: **no incluir claves reales en logs, Markdown, commits, prompts, screenshots o respuestas**.

---

## 6. Rutas principales

### Públicas / semi-públicas

- `/`
- `/market`
- `/signals`
- `/pricing`
- `/learn`
- `/roadmap`
- `/disclaimer`
- `/terms`
- `/privacy`
- `/contact`

### Protegidas

- `/dashboard`
- `/account`
- `/watchlist`
- `/alerts`
- `/portfolio`

### Admin

- `/admin`
- `/admin/status`
- `/admin/signals`
- `/admin/plans`
- `/admin/performance`

### APIs

- `/api/market/snapshot`
- `/api/signals/generate`
- `/api/cron/generate-signals`
- `/api/admin/signals/generate`
- `/api/admin/plans/update`
- `/api/admin/status`
- `/api/admin/performance/evaluate`
- `/api/alerts/settings`
- `/api/alerts/read`
- `/api/watchlist/toggle`
- `/api/billing/checkout`
- `/api/billing/portal`
- `/api/stripe/webhook`
- `/api/portfolio/positions`

---

## 7. Tablas Supabase actuales/contempladas

### Señales

- `public.signals`
- `public.signal_outcomes`

### Usuario

- `public.user_watchlist`
- `public.user_alert_settings`
- `public.user_notifications`
- `public.user_plans`
- `public.user_portfolio_positions`

### Campos relevantes de `user_plans`

Debe contener:

- `user_id`
- `plan`
- `status`
- `current_period_end`
- `stripe_customer_id`
- `stripe_subscription_id`
- `created_at`
- `updated_at`

La presencia de `stripe_customer_id` y `stripe_subscription_id` es esencial para Stripe Customer Portal.

---

## 8. Patrón de autenticación y admin

Un usuario autenticado se obtiene con Supabase Auth.

Un usuario es admin si su email está incluido en `ADMIN_EMAILS`.

Nunca confiar en checks solo del frontend para operaciones admin.  
Toda API admin debe comprobar sesión y rol en servidor.

---

## 9. Stripe: estado y reglas

Stripe Checkout y Customer Portal funcionan.

Flujo correcto:

```txt
/pricing
→ Checkout Stripe
→ checkout.session.completed
→ /api/stripe/webhook
→ upsert public.user_plans
→ guarda stripe_customer_id y stripe_subscription_id
→ /account muestra plan real
→ "Gestionar suscripción" abre Stripe Customer Portal
```

Reglas:

- No tocar webhook salvo tarea específica.
- Webhook debe verificar firma.
- Webhook debe leer raw body.
- Webhook no debe imprimir secretos.
- Webhook debe persistir `stripe_customer_id` y `stripe_subscription_id`.

---

## 10. Señales y scoring

El motor de señales trabaja con:

- `symbol`
- `signal_type`: LONG / SHORT / WAIT
- `score`
- `risk`: LOW / MEDIUM / HIGH
- `timeframe`
- `price`
- `reason`
- `rsi`
- `sma20`
- `volume_ratio`
- `trend`
- `source`
- `expires_at`
- `created_at`

Regla importante: el `score` no debe comunicarse como “probabilidad garantizada de acierto”.  
Debe presentarse como **fuerza de lectura/confluencia técnica**.

---

## 11. Portfolio

Portfolio representa **activos que el usuario posee o registra como posición**.

Watchlist representa **activos que el usuario quiere vigilar**.

No son lo mismo, pero deben integrarse en fases futuras:

- Añadir posición también a Watchlist.
- Ver señales sobre mis posiciones.
- Alertas sobre mi portfolio.
- Dashboard de exposición.
- Peso por activo, tipo, sector, plataforma y divisa.
- Importación CSV/captura/API.

---

## 12. Diferencia entre Portfolio y Watchlist

```txt
Watchlist = activos que quiero seguir.
Portfolio = activos que realmente tengo registrados.
```

Ambas secciones deben convivir.

---

## 13. UI / UX

La UI debe ser:

- oscura,
- premium,
- clara,
- con cards,
- con badges,
- con buen espaciado,
- sin tablas crudas salvo que aporten valor,
- responsive,
- sin scroll horizontal feo,
- con leyendas visibles mediante `PageHelp`.

Cada página importante debe explicar qué significa lo que muestra.

---

## 14. PageHelp

Las páginas principales deben tener un bloque explicativo o leyenda visible:

- Dashboard.
- Señales.
- Watchlist.
- Alertas.
- Mercado.
- Cuenta.
- Portfolio.

El objetivo es que un usuario principiante entienda:

- qué ve,
- cómo interpretarlo,
- qué límites tiene,
- qué no debe asumir.

---

## 15. Legal / regulación

VortSignal no debe decir:

- “compra ahora”,
- “vende ahora”,
- “beneficio asegurado”,
- “rentabilidad garantizada”,
- “apláncate aquí”,
- “esta es la operación que debes hacer”.

Debe decir:

- “lectura técnica”,
- “análisis informativo”,
- “simulación”,
- “seguimiento”,
- “posible escenario”,
- “no constituye asesoramiento financiero personalizado”.

Cualquier función de asistente de cartera debe quedar bajo enfoque educativo hasta revisión legal/licencia.

---

## 16. Cómo debe actuar un agente IA

El agente debe ser conservador con zonas críticas:

No tocar sin petición explícita:

- Stripe webhook.
- Checkout.
- Customer Portal.
- Supabase Auth.
- Security/RLS.
- Scoring.
- Cron.
- Generación de señales.
- Env vars.
- Package/dependencies.

Debe ejecutar siempre:

```powershell
npm run build
```

antes de dar una tarea por finalizada.

Debe indicar archivos creados/modificados antes de editar si el usuario lo pide o si la tarea es amplia.

---

## 17. Flujo de trabajo recomendado

1. Revisar estado:
   ```powershell
   pwd
   git status
   ```

2. Aplicar cambios acotados.

3. Build:
   ```powershell
   npm run build
   ```

4. Prueba local:
   ```powershell
   npm run dev
   ```

5. Commit:
   ```powershell
   git add ...
   git commit -m "Mensaje claro"
   git push
   ```

6. Deploy:
   ```powershell
   vercel --prod
   ```

---

## 18. Prioridad actual

Prioridad inmediata:

1. Pulir Portfolio.
2. Integrar Portfolio ↔ Watchlist.
3. Añadir señales sobre mis posiciones.
4. Añadir alertas sobre portfolio.
5. Mejorar performance/backtesting.
6. Backend admin avanzado.
7. Noticias de mercado.
8. Importaciones CSV/captura/API.
9. Asistente educativo de cartera.
10. Marketplace de bots/herramientas.
