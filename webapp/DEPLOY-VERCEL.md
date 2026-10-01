# Despliegue en Vercel — StockIA Web Application (frontend + fake API)

Esta app es 100% estática (Angular + fake API en el navegador), así que no necesita configurar ninguna base de
datos ni variable de entorno secreta en Vercel.

## Opción A — Desde la web de Vercel (sin terminal)

1. Sube esta carpeta (`stockia-webapp/`) como un repositorio nuevo a GitHub — por ejemplo dentro de tu
   organización `upc-pre-202602-1ASI0729-7747-databit`, repo `stockia-webapp` (ya existe, vacío salvo un
   README, según lo que ya tienes en GitHub).
   ```bash
   cd stockia-webapp
   git init
   git add .
   git commit -m "feat: scaffold Angular frontend + fake API (DDD por bounded context)"
   git branch -M develop
   git remote add origin https://github.com/upc-pre-202602-1ASI0729-7747-databit/stockia-webapp.git
   git push -u origin develop
   ```
2. Entra a [vercel.com](https://vercel.com) → inicia sesión con tu cuenta de GitHub.
3. Click en **"Add New…" → "Project"**.
4. Selecciona el repositorio `stockia-webapp` (si no aparece, usa "Adjust GitHub App Permissions" para darle
   acceso a Vercel sobre la organización del curso).
5. En **"Configure Project"**:
   - **Framework Preset:** Vercel detecta automáticamente "Angular" (si no, selecciónalo manualmente).
   - **Build Command:** `npm run build` (ya viene definido en `vercel.json`, no hace falta tocarlo).
   - **Output Directory:** `dist/stockia-webapp/browser` (también viene en `vercel.json`).
   - **Install Command:** déjalo en `npm install` (default).
6. Click **"Deploy"**. Vercel instala dependencias, compila con `ng build` y publica el sitio.
7. Al terminar, te da una URL tipo `https://stockia-webapp-xxxx.vercel.app`. Pruébala: deberías ver la pantalla
   de login y poder navegar con las credenciales de prueba del README.

## Opción B — Desde la terminal con Vercel CLI

```bash
cd stockia-webapp
npm install -g vercel          # si no lo tienes instalado
vercel login                   # abre el navegador para autenticarte
vercel                         # primer deploy (preview) — responde las preguntas:
#   Set up and deploy? Yes
#   Which scope? tu cuenta o la de la organización
#   Link to existing project? No
#   Project name? stockia-webapp
#   Directory? ./ (la carpeta actual)
#   Override settings? No (vercel.json ya trae build/output configurados)
```

Cuando el preview se vea bien, publica a producción:

```bash
vercel --prod
```

## Verificación post-deploy (checklist)

- [ ] La URL carga la pantalla de login (`/auth/sign-in`) sin errores en consola.
- [ ] Iniciar sesión con `admin@databitecorp.com` / `stockia123` lleva al Dashboard.
- [ ] Recargar la página (F5) estando en `/app/inventory` **no** da 404 — si da 404, revisa que
      `vercel.json` tenga el `rewrite` a `/index.html` (ya incluido en este proyecto) y vuelve a desplegar.
- [ ] "Simular venta" en Recetas descuenta stock visible en Inventario.
- [ ] "Generar nueva predicción" en Predicción de Demanda muestra un nuevo gráfico.

## Actualizar el deploy después de un cambio

Con GitHub conectado (Opción A), cada `git push` a la rama configurada (recomendado: `develop`, igual que en
`stockia-report`) dispara un nuevo deploy automático en Vercel — exactamente el mismo flujo que ya usas para
`stockia-landing`.

## Nota sobre el backend real (Sprint 2 en adelante)

Este deploy usa la fake API (`angular-in-memory-web-api`) — no hay base de datos real ni servidor backend
todavía. Cuando el equipo tenga el backend desplegado, sigue los 3 pasos de la sección "Conectar el backend
real" del `README.md` y vuelve a desplegar; Vercel no necesita ninguna configuración adicional porque el
frontend seguirá siendo un sitio estático que solo cambia a qué URL apunta sus llamadas `HttpClient`.
