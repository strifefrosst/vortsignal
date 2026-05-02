# AGENT_TASKS.md — Tareas y prompts para agentes IA

> Este archivo está diseñado para que un agente IA trabaje de forma autónoma, pero controlada, dentro de VortSignal.

---

## 0. Protocolo obligatorio antes de cualquier tarea

Ejecutar:

```powershell
pwd
git status
```

Confirmar:

```txt
C:\Users\eMeir\vortsignal
```

Si el working tree no está limpio:

1. No editar.
2. Mostrar archivos pendientes.
3. Preguntar si se deben commitear, descartar o revisar.

Nunca trabajar en otro proyecto como Vortloop, FitApp u otro directorio.

---

## 1. Archivos que NO se deben tocar salvo petición explícita

No tocar:

```txt
.env.local
package.json
package-lock.json
next.config.ts
tsconfig.json
app/api/stripe/webhook/route.ts
app/api/billing/checkout/route.ts
app/api/billing/portal/route.ts
lib/signals/scoring.ts
lib/signals/generate.ts
app/api/cron/generate-signals/route.ts
lib/supabase/admin.ts
```

Excepciones: solo si la tarea lo pide explícitamente.

---

## 2. Flujo de cierre obligatorio

Al terminar una tarea:

```powershell
npm run build
git status
```

Indicar:

- archivos creados,
- archivos modificados,
- rutas afectadas,
- pruebas manuales recomendadas.

No dar la tarea por terminada si `npm run build` falla.

---

# TAREA A — Pulir UI de Portfolio

## Objetivo

Mejorar estética y UX de `/portfolio` sin cambiar backend.

## Prompt para agente

```txt
Trabaja únicamente en C:\Users\eMeir\vortsignal.

Antes de editar ejecuta pwd y git status. Si el working tree no está limpio, detente.

Objetivo:
Pulir visualmente /portfolio para que parezca una sección premium integrada en VortSignal.

Archivos permitidos:
- app/portfolio/page.tsx
- components/PortfolioPositionForm.tsx
- components/PortfolioPositionsList.tsx
- components/PageHelp.tsx si es estrictamente necesario

No tocar:
- API de portfolio
- Stripe
- Auth
- scoring
- generación de señales
- package.json
- next.config.ts
- tsconfig.json

Requisitos:
1. Mantener SiteHeader/AppShell.
2. Hero compacto y profesional.
3. Resumen de cartera con cards equilibradas.
4. Guía legible, no comprimida.
5. Formulario premium con placeholders coherentes:
   - BTCUSDC, AAPL, VWCE...
   - Bitcoin, Apple, Vanguard FTSE...
   - Trade Republic, Revolut, Binance...
6. Estado vacío elegante.
7. Lista/card de posiciones legible.
8. Badges discretos de futuro:
   - CSV próximamente
   - Capturas próximamente
   - API futuras
9. Responsive sin scroll horizontal.
10. Ejecutar npm run build al final.
```

---

# TAREA B — Integrar Portfolio con Watchlist

## Objetivo

Conectar activos poseídos con activos vigilados.

## Prompt para agente

```txt
Trabaja únicamente en C:\Users\eMeir\vortsignal.

Antes de editar ejecuta pwd y git status. Si el working tree no está limpio, detente.

Objetivo:
Integrar Portfolio con Watchlist.

Contexto:
Watchlist = activos vigilados.
Portfolio = activos registrados como posición real/manual.

Tareas:
1. En /portfolio mostrar si cada posición está en watchlist.
2. Añadir botón:
   - "Añadir a Mi lista"
   - "Quitar de Mi lista"
3. Reutilizar la API existente /api/watchlist/toggle si es posible.
4. En /watchlist mostrar pequeño aviso:
   "Algunos activos vigilados pueden formar parte de tu portfolio."
5. En Dashboard añadir bloque:
   "Señales sobre mis posiciones"
   con CTA a /signals?portfolio=true si existe o preparar enlace futuro.
6. No crear nueva tabla si no hace falta.
7. No mezclar semánticamente Portfolio y Watchlist.
8. Mantener UI premium.
9. Ejecutar npm run build.

No tocar Stripe, Auth, scoring ni generación de señales.
```

---

# TAREA C — Filtro “Solo mi portfolio” en señales

## Objetivo

Permitir filtrar señales por activos que el usuario tiene en portfolio.

## Prompt para agente

```txt
Trabaja únicamente en C:\Users\eMeir\vortsignal.

Antes de editar ejecuta pwd y git status. Si el working tree no está limpio, detente.

Objetivo:
Añadir filtro portfolio=true en /signals.

Tareas:
1. Actualizar app/signals/page.tsx para soportar query param portfolio=true.
2. Si portfolio=true:
   - requerir usuario autenticado.
   - leer símbolos de public.user_portfolio_positions del usuario.
   - filtrar señales por esos símbolos.
3. Si el usuario no tiene posiciones, mostrar estado vacío con CTA a /portfolio.
4. Actualizar components/SignalsFilterBar.tsx si existe para añadir toggle "Solo mi portfolio".
5. Mantener watchlist=true funcionando.
6. Si watchlist=true y portfolio=true se combinan, usar intersección o mostrar aviso claro.
7. Añadir PageHelp o texto explicativo.
8. Ejecutar npm run build.

No tocar generación de señales ni scoring.
```

---

# TAREA D — Alertas sobre portfolio

## Objetivo

Permitir que alertas se limiten a posiciones reales.

## Prompt para agente

```txt
Trabaja únicamente en C:\Users\eMeir\vortsignal.

Antes de editar ejecuta pwd y git status. Si el working tree no está limpio, detente.

Objetivo:
Añadir configuración de alertas para "solo mi portfolio".

Tareas:
1. Revisar user_alert_settings.
2. Si hace falta SQL, detenerse y proponer migración antes de tocar código.
3. Añadir opción visual en /alerts:
   - Todas
   - Solo mi watchlist
   - Solo mi portfolio
4. Ajustar lógica de notificaciones para respetar portfolio si la columna/config existe.
5. Mantener retrocompatibilidad con watchlist_only.
6. No romper alertas existentes.
7. Ejecutar npm run build.

No tocar Stripe ni scoring.
```

---

# TAREA E — Mejorar performance/backtesting

## Objetivo

Medir calidad del motor.

## Prompt para agente

```txt
Trabaja únicamente en C:\Users\eMeir\vortsignal.

Antes de editar ejecuta pwd y git status. Si el working tree no está limpio, detente.

Objetivo:
Mejorar /admin/performance.

Tareas:
1. Añadir filtros por:
   - símbolo
   - tipo de señal
   - source
   - resultado
2. Añadir métricas:
   - win rate por símbolo
   - win rate por source
   - pct_change medio por tipo
   - total evaluadas últimas 24h/7d/30d
3. Añadir explicación clara de limitaciones.
4. No cambiar tabla sin proponer SQL.
5. No tocar scoring.
6. Ejecutar npm run build.
```

---

# TAREA F — CSV import para Portfolio

## Objetivo

Permitir importar posiciones desde CSV sin APIs externas.

## Prompt para agente

```txt
Trabaja únicamente en C:\Users\eMeir\vortsignal.

Antes de editar ejecuta pwd y git status. Si el working tree no está limpio, detente.

Objetivo:
Añadir importación CSV básica para Portfolio.

Tareas:
1. Crear componente PortfolioCsvImport.tsx.
2. Permitir pegar CSV en textarea o subir archivo si no requiere dependencias.
3. Formato esperado:
   symbol,asset_name,asset_type,quantity,average_price,currency,platform
4. Previsualizar filas antes de guardar.
5. Validar filas.
6. Guardar usando API existente o nueva API batch si es necesario.
7. No guardar filas inválidas.
8. Mostrar errores por fila.
9. Ejecutar npm run build.

No instalar paquetes.
No tocar Stripe ni Auth.
```

---

# TAREA G — Noticias de mercado

## Objetivo

Crear base de sección de noticias sin scraping agresivo.

## Prompt para agente

```txt
Trabaja únicamente en C:\Users\eMeir\vortsignal.

Antes de editar ejecuta pwd y git status. Si el working tree no está limpio, detente.

Objetivo:
Crear sección inicial /news para noticias de mercado.

Tareas:
1. Crear app/news/page.tsx.
2. Crear UI mock con cards de noticias.
3. Explicar que en fase inicial se usarán RSS/APIs permitidas.
4. No implementar scraping real todavía salvo petición explícita.
5. Añadir PageHelp.
6. Añadir link en footer, no necesariamente en header.
7. Ejecutar npm run build.

Restricción:
No scrapear webs reales en esta tarea.
```

---

# TAREA H — Backend admin avanzado

## Objetivo

Convertir `/admin` en centro operativo más potente.

## Prompt para agente

```txt
Trabaja únicamente en C:\Users\eMeir\vortsignal.

Antes de editar ejecuta pwd y git status. Si el working tree no está limpio, detente.

Objetivo:
Mejorar /admin como backend interno empresarial.

Tareas:
1. Reorganizar /admin en módulos:
   - Estado
   - Señales
   - Planes
   - Performance
   - Usuarios futuro
   - Alertas futuro
   - Portfolio futuro
   - Noticias futuro
2. Añadir cards con estado actual/futuro.
3. No crear APIs nuevas salvo necesario.
4. Mantener protección admin.
5. Ejecutar npm run build.
```

---

# TAREA I — Asistente educativo de cartera

## Objetivo

Crear onboarding de perfil inversor sin dar asesoramiento personalizado.

## Prompt para agente

```txt
Trabaja únicamente en C:\Users\eMeir\vortsignal.

Antes de editar ejecuta pwd y git status. Si el working tree no está limpio, detente.

Objetivo:
Crear base de cuestionario educativo de cartera.

Tareas:
1. Crear /portfolio/profile o /portfolio/onboarding.
2. Preguntar:
   - experiencia
   - horizonte temporal
   - tolerancia al riesgo
   - objetivo
   - preferencia de activos
   - liquidez deseada
   - volatilidad aceptada
   - DCA sí/no
3. Guardar respuestas solo si existe tabla adecuada; si no, proponer SQL antes.
4. Mostrar resultado educativo, no recomendación personalizada.
5. Incluir disclaimer.
6. Ejecutar npm run build.

No usar frases de recomendación directa.
```

---

## 3. Orden recomendado para agentes autónomos

1. Pulir UI Portfolio.
2. Integrar Portfolio ↔ Watchlist.
3. Filtro señales por Portfolio.
4. Alertas por Portfolio.
5. CSV import.
6. Mejorar Performance.
7. Backend admin avanzado.
8. Noticias mock.
9. Asistente educativo cartera.
10. Marketplace bots/herramientas.

---

## 4. Formato de respuesta esperado del agente

Al terminar cada tarea, responder:

```txt
Hecho.

Archivos creados:
- ...

Archivos modificados:
- ...

Build:
- npm run build: OK / ERROR

Pruebas recomendadas:
- ...

Notas:
- ...
```

No extenderse con explicaciones innecesarias si todo va bien.
