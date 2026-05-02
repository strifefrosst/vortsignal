# TEST_PLAN.md — Plan de pruebas de VortSignal

> Este documento define pruebas manuales, funcionales y de regresión para VortSignal.

---

## 1. Objetivo

Evitar que una mejora rompa:

- Auth,
- Stripe,
- señales,
- dashboard,
- watchlist,
- alertas,
- portfolio,
- admin,
- pages públicas,
- build/deploy.

---

## 2. Comandos base

Antes de probar:

```powershell
npm run build
npm run dev
```

Si hay procesos Next colgados:

```powershell
taskkill /IM node.exe /F
npm run dev
```

---

## 3. Prueba de rutas públicas

Abrir:

```txt
/
 /market
 /signals
 /pricing
 /learn
 /roadmap
 /disclaimer
 /terms
 /privacy
 /contact
 /robots.txt
 /sitemap.xml
```

Validar:

- cargan,
- tienen header/footer si corresponde,
- no muestran errores,
- no exponen secretos,
- textos en español,
- responsive razonable.

---

## 4. Auth

### Signup/Login

1. Ir a `/signup`.
2. Crear usuario de prueba.
3. Confirmar si aplica.
4. Ir a `/login`.
5. Iniciar sesión.

Validar:

- al loguear desaparece “Entrar”,
- aparece “Cerrar sesión”,
- aparece Cuenta,
- si admin, aparece Admin/badge ADMIN,
- aparece badge de plan.

### Logout

1. Pulsar “Cerrar sesión”.
2. Verificar que vuelve a `/login` o `/`.
3. Rutas privadas redirigen a `/login`.

---

## 5. Dashboard

Ruta:

```txt
/dashboard
```

Validar:

- requiere login,
- muestra datos reales,
- muestra señales,
- muestra watchlist si existe,
- muestra alertas si existen,
- muestra portfolio si existe,
- PageHelp visible,
- no rompe si no hay datos.

---

## 6. Señales

Ruta:

```txt
/signals
```

Validar:

- señales cargan,
- filtros funcionan,
- filtro watchlist funciona si existe,
- PageHelp explica:
  - LONG,
  - SHORT,
  - WAIT,
  - score,
  - riesgo,
  - RSI,
  - volumen,
  - tendencia.
- no hay scroll horizontal feo,
- fechas legibles.

---

## 7. Mercado

Ruta:

```txt
/market
```

Validar:

- snapshots cargan,
- activos soportados aparecen,
- RSI/SMA/volumen/tendencia se ven,
- si Binance falla, error controlado,
- PageHelp visible.

---

## 8. Watchlist

Ruta:

```txt
/watchlist
```

Validar:

- requiere login,
- añadir activo,
- quitar activo,
- límite por plan:
  - Free hasta 3,
  - Pro hasta 10,
  - Elite ilimitado.
- dashboard refleja watchlist,
- señales pueden filtrarse por watchlist,
- PageHelp visible.

---

## 9. Alertas

Ruta:

```txt
/alerts
```

Validar:

- requiere login,
- configuración carga,
- guardar settings,
- min score,
- tipos LONG/SHORT/WAIT,
- riesgos LOW/MEDIUM/HIGH,
- watchlist only,
- lista de notificaciones,
- marcar leída,
- PageHelp visible.

---

## 10. Portfolio

Ruta:

```txt
/portfolio
```

Validar:

- requiere login,
- header visible,
- footer visible,
- PageHelp visible,
- formulario visible,
- crear posición:
  - BTCUSDC,
  - Bitcoin,
  - CRYPTO,
  - quantity,
  - average_price,
  - currency,
  - platform.
- lista muestra posición,
- valor invertido = quantity * average_price,
- borrar posición,
- dashboard refleja número de posiciones,
- no hay scroll horizontal,
- estado vacío elegante.

SQL de verificación:

```sql
select *
from public.user_portfolio_positions
order by created_at desc
limit 20;
```

---

## 11. Planes / Stripe Checkout

Ruta:

```txt
/pricing
```

Validar:

- Free/Pro/Elite visibles,
- precios correctos,
- disclaimers visibles,
- checkout Pro/Elite abre Stripe,
- pago test con:
  ```txt
  4242 4242 4242 4242
  ```
- vuelve a `/account`,
- plan se actualiza.

---

## 12. Stripe Webhook

En Stripe:

- evento `checkout.session.completed` llega a:
  ```txt
  https://vortsignal.vercel.app/api/stripe/webhook
  ```

Validar:

- status 200,
- Supabase `user_plans` actualiza:
  - plan,
  - status,
  - stripe_customer_id,
  - stripe_subscription_id.

SQL:

```sql
select
  user_id,
  plan,
  status,
  stripe_customer_id,
  stripe_subscription_id,
  updated_at
from public.user_plans
order by updated_at desc
limit 10;
```

Logs:

```powershell
vercel logs https://vortsignal.vercel.app --follow
```

---

## 13. Stripe Customer Portal

Ruta:

```txt
/account
```

Validar:

- usuario Pro/Elite con `stripe_customer_id` ve “Gestionar suscripción”.
- botón abre Stripe Customer Portal.
- puede ver suscripción.
- puede cancelar o gestionar método de pago en modo test.

---

## 14. Account

Ruta:

```txt
/account
```

Validar:

- email visible,
- plan visible,
- status visible,
- rol visible,
- admin badge si aplica,
- botón admin si admin,
- botón portal si Pro/Elite con customer id,
- CTA pricing si Free,
- logout.

---

## 15. Admin Hub

Ruta:

```txt
/admin
```

Validar:

- no login → login,
- no admin → acceso denegado,
- admin → entra,
- cards:
  - Status,
  - Signals,
  - Plans,
  - Performance.

---

## 16. Admin Status

Ruta:

```txt
/admin/status
```

Validar:

- entorno muestra configured/missing sin valores,
- Supabase OK,
- Binance OK o error controlado,
- Stripe OK,
- señales recientes,
- cron status,
- alertas/usuarios,
- no secrets.

---

## 17. Admin Signals

Ruta:

```txt
/admin/signals
```

Validar:

- admin only,
- generar señales manualmente,
- signals se insertan,
- dashboard/signals se actualizan.

---

## 18. Admin Plans

Ruta:

```txt
/admin/plans
```

Validar:

- admin only,
- cambiar plan por email,
- account refleja nuevo plan,
- límites watchlist cambian.

---

## 19. Admin Performance

Ruta:

```txt
/admin/performance
```

Validar:

- admin only,
- métricas visibles,
- botón evaluar caducadas,
- resultados insertados en `signal_outcomes`,
- no se duplica outcome por signal/horizon.

SQL:

```sql
select *
from public.signal_outcomes
order by evaluated_at desc
limit 20;
```

---

## 20. Cron

En Vercel Hobby, cron debe ser diario.

Validar `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/generate-signals",
      "schedule": "0 0 * * *"
    }
  ]
}
```

No usar cron horario en Hobby.

---

## 21. Legal

Validar:

- `/disclaimer`
- `/terms`
- `/privacy`
- `/contact`

Deben contener:

- no asesoramiento financiero,
- no garantía de resultados,
- riesgos,
- privacidad,
- placeholders claros si faltan datos legales.

---

## 22. Roadmap / Learn

Validar:

- `/roadmap` existe.
- `/learn` existe.
- Tutorial principiante completo.
- Tutorial avanzado completo.
- Roadmap incluye:
  - backend admin avanzado,
  - noticias,
  - marketplace bots,
  - portfolio,
  - importaciones,
  - asistente de cartera.

---

## 23. Responsive

Probar al menos:

- desktop,
- tablet estrecha,
- móvil.

Validar:

- header usable,
- cards apiladas,
- sin scroll horizontal,
- formularios legibles.

---

## 24. Regresión antes de cada deploy

Antes de `vercel --prod`:

```powershell
npm run build
git status
```

Probar mínimo:

```txt
/
 /dashboard
 /signals
 /pricing
 /account
 /admin
```

Si la tarea toca portfolio, probar `/portfolio`.

Si toca Stripe, probar checkout/webhook/portal.

Si toca señales, probar generation/signals/dashboard.

---

## 25. Criterio de aceptación

Una tarea está OK si:

- build pasa,
- ruta principal carga,
- no rompe rutas existentes,
- no imprime secretos,
- commits claros,
- deploy OK,
- prueba mínima manual OK.
