# SECURITY_POLICY.md — Seguridad, privacidad y límites operativos

> Este documento define reglas de seguridad para agentes IA y desarrolladores que trabajen en VortSignal.

---

## 1. Principio general

VortSignal maneja:

- usuarios,
- emails,
- planes,
- pagos mediante Stripe,
- watchlists,
- alertas,
- portfolios,
- señales,
- datos potencialmente sensibles sobre comportamiento financiero.

La seguridad debe tratarse como prioridad de producto, no como añadido posterior.

---

## 2. Secretos y variables

Nunca imprimir, exponer, commitear ni registrar:

```env
SUPABASE_SECRET_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
CRON_SECRET
SIGNALS_GENERATE_SECRET
ADMIN_EMAILS completo si no hace falta
```

Variables publicables como `NEXT_PUBLIC_SUPABASE_URL` o publishable key no son equivalentes a secret keys, pero aun así no deben repetirse innecesariamente.

---

## 3. Si una clave se expone

Si una clave secreta aparece en chat, logs, screenshot o commit:

1. Considerarla comprometida.
2. Rotarla.
3. Actualizar `.env.local`.
4. Actualizar Vercel Environment Variables.
5. Redeploy.
6. Verificar funcionamiento.
7. No reutilizar la clave antigua.

---

## 4. Git

No commitear:

- `.env.local`
- `.vercel`
- dumps con datos reales
- screenshots con claves
- logs con tokens
- archivos temporales con secretos

`.gitignore` debe incluir:

```txt
.env.local
.vercel
```

---

## 5. Supabase

### RLS

Toda tabla con datos de usuario debe tener RLS.

Tablas de usuario:

- `user_watchlist`
- `user_alert_settings`
- `user_notifications`
- `user_plans`
- `user_portfolio_positions`

Regla general:

- usuario solo lee/crea/edita/borra lo suyo.
- admin operations deben ir por servidor con comprobación admin.

### Service role / secret key

`SUPABASE_SECRET_KEY` solo en servidor.

Nunca usar secret key en client components.

---

## 6. Auth

Todas las rutas privadas deben:

- comprobar sesión,
- redirigir a `/login` si no hay usuario,
- no confiar en estado de frontend para permisos críticos.

Rutas protegidas:

- `/dashboard`
- `/account`
- `/watchlist`
- `/alerts`
- `/portfolio`

Rutas admin:

- `/admin`
- `/admin/status`
- `/admin/signals`
- `/admin/plans`
- `/admin/performance`

APIs admin deben comprobar:

1. usuario autenticado,
2. email en `ADMIN_EMAILS`.

---

## 7. Stripe

### Webhook

Reglas críticas:

- leer raw body con `request.text()`,
- verificar `Stripe-Signature`,
- usar `STRIPE_WEBHOOK_SECRET`,
- no imprimir headers completos,
- no imprimir secrets,
- devolver 500 si falla persistencia crítica,
- guardar `stripe_customer_id`,
- guardar `stripe_subscription_id`.

### Checkout

- crear sesiones en servidor,
- no exponer secret key,
- usar metadata:
  - `user_id`
  - `plan`
- usar `subscription_data.metadata` también.

### Customer Portal

- abrir portal usando `stripe_customer_id`,
- si falta, mostrar error elegante,
- no buscar por email salvo fallback controlado.

---

## 8. APIs internas

Toda API que modifique datos debe validar:

- método,
- sesión,
- propiedad del recurso,
- payload,
- tipos,
- límites,
- errores controlados.

No devolver stacktraces crudos al cliente.

---

## 9. Portfolio

Portfolio contiene datos financieros personales del usuario.

Reglas:

- posiciones solo visibles por su dueño.
- DELETE debe filtrar por `user_id`.
- POST debe usar `user_id` autenticado, nunca confiar en user_id enviado por cliente.
- evitar guardar credenciales externas.
- si en futuro se importan brokers, usar OAuth/API oficial siempre que sea posible.

---

## 10. Watchlist

Watchlist no implica posesión de activo.

No mezclar:

```txt
Watchlist = vigilar.
Portfolio = poseer/registrar posición.
```

---

## 11. Noticias y scraping

Para noticias:

- Priorizar APIs oficiales.
- Priorizar RSS.
- Respetar términos.
- Respetar robots.txt.
- No copiar artículos completos.
- Mostrar fuente.
- No usar scraping agresivo.
- No saltarse paywalls.
- No infringir derechos de autor.

---

## 12. Marketplace de bots

Antes de permitir bots o automatización:

- separar educativo vs ejecución,
- añadir disclaimers,
- logs de acciones,
- límites de riesgo,
- confirmación explícita,
- control de permisos,
- revisión legal.

No activar trading real automáticamente en primera fase.

---

## 13. Legal financiero

VortSignal no debe comunicar:

- asesoramiento financiero personalizado,
- recomendaciones personalizadas,
- garantía de rentabilidad,
- certeza de resultado,
- instrucciones directas de compra/venta.

Lenguaje permitido:

- análisis informativo,
- lectura técnica,
- simulación,
- seguimiento,
- escenario posible,
- herramienta educativa.

Toda página relacionada con señales, portfolio y performance debe incluir recordatorio de riesgo.

---

## 14. Logs

Logs permitidos:

- evento recibido,
- booleanos,
- IDs internos parciales si no son secretos,
- errores controlados.

No loguear:

- claves,
- tokens,
- headers completos,
- payloads completos de usuario,
- datos financieros innecesarios,
- cuerpos enteros de webhooks.

---

## 15. Dependencias

No instalar paquetes sin necesidad clara.

Antes de instalar:

1. justificar,
2. revisar mantenimiento,
3. revisar seguridad,
4. confirmar con usuario.

---

## 16. Reglas para agentes IA

Un agente IA debe:

- detenerse si working tree está sucio,
- no tocar archivos críticos sin permiso,
- no imprimir secretos,
- hacer build,
- informar archivos cambiados,
- no modificar varias áreas críticas a la vez.

---

## 17. Archivos críticos

Alto riesgo:

```txt
app/api/stripe/webhook/route.ts
app/api/billing/checkout/route.ts
app/api/billing/portal/route.ts
lib/supabase/admin.ts
lib/signals/generate.ts
lib/signals/scoring.ts
app/api/cron/generate-signals/route.ts
middleware/proxy si existe
```

Requieren cuidado extra.

---

## 18. Checklist de seguridad antes de producción

- [ ] No hay secretos en repo.
- [ ] `.env.local` ignorado.
- [ ] Vercel envs configuradas en Production.
- [ ] Stripe webhook apunta a producción.
- [ ] Supabase URL correcta.
- [ ] RLS activado en tablas de usuario.
- [ ] APIs admin protegidas.
- [ ] Build pasa.
- [ ] Páginas legales visibles.
- [ ] Disclaimer en señales/portfolio.
- [ ] Portal Stripe funciona.
- [ ] Logs sin secrets.
