# Desplegar stockia-mock-api

`json-server` es un proceso Node de larga duración que escribe en un archivo (`db.json`) — por eso **no es
un buen candidato para Vercel** (que es serverless: cada invocación puede correr en una instancia nueva y
descartar lo que se escribió en el disco). Para que los POST/PUT/DELETE del frontend realmente persistan
mientras pruebas, usa un host que mantenga un proceso Node corriendo. Abajo las dos opciones, en orden de
recomendación.

## Opción recomendada — Render (gratis, con proceso persistente)

1. Sube esta carpeta (`stockia-mock-api/`) a un repo de GitHub — por ejemplo, un repo nuevo
   `stockia-mock-api` en tu organización:
   ```bash
   cd stockia-mock-api
   git init
   git add .
   git commit -m "feat: mock API de StockIA (json-server)"
   git branch -M main
   git remote add origin https://github.com/upc-pre-202602-1ASI0729-7747-databit/stockia-mock-api.git
   git push -u origin main
   ```
2. Entra a [render.com](https://render.com) → inicia sesión con GitHub.
3. **New → Web Service** → selecciona el repo `stockia-mock-api`.
4. Configuración:
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
5. Click **Create Web Service**. Render te da una URL tipo `https://stockia-mock-api.onrender.com`.
6. Prueba: `https://stockia-mock-api.onrender.com/api/v1/health` debe responder `{"status":"ok",...}`.

**Limitación a tener presente (plan gratis):** el servicio se "duerme" tras ~15 min sin tráfico y, al
despertar, vuelve a arrancar desde el `db.json` que subiste a GitHub — cualquier dato creado/editado desde el
frontend mientras estuvo despierto se pierde al dormirse. Para una demo o sustentación esto es aceptable
(persiste durante toda la sesión de uso); si necesitas persistencia real entre reinicios, sube a un plan
pago de Render con disco persistente, o reemplázalo por el backend real cuando exista.

## Opción alternativa — Vercel (serverless, SOLO lectura confiable)

Puedes desplegarlo en Vercel envolviendo json-server en una función serverless, pero **cada escritura
(POST/PUT/DELETE) puede perderse en la siguiente invocación** porque Vercel no garantiza la misma instancia
ni el mismo disco entre requests. Úsalo solo si necesitas que el frontend lea datos de ejemplo ya cargados
(GET) y no te importa que las escrituras sean efímeras.

1. Crea `api/index.js` en esta carpeta:
   ```js
   import jsonServer from 'json-server';
   import path from 'path';

   const server = jsonServer.create();
   const router = jsonServer.router(path.join(process.cwd(), 'db.json'));
   const middlewares = jsonServer.defaults();

   server.use(middlewares);
   server.use(jsonServer.bodyParser);
   server.use(jsonServer.rewriter({ '/api/v1/*': '/$1', '/api/v1': '/' }));
   server.use(router);

   export default server;
   ```
2. Crea `vercel.json`:
   ```json
   {
     "builds": [{ "src": "api/index.js", "use": "@vercel/node" }],
     "rewrites": [{ "source": "/(.*)", "destination": "/api/index.js" }]
   }
   ```
3. `npm i -g vercel && vercel --prod` (o conecta el repo desde la web de Vercel, igual que hiciste con
   `stockia-landing` y `stockia-webapp`).

## Conectar el frontend a la API ya desplegada

Una vez tengas la URL (Render o Vercel), edita en `stockia-webapp`:

`src/environments/environment.ts` y `environment.prod.ts`:
```ts
export const environment = {
  production: false, // true en environment.prod.ts
  useFakeApi: false,  // ya NO uses angular-in-memory-web-api
  apiBaseUrl: 'https://stockia-mock-api.onrender.com/api/v1',
};
```

Con `useFakeApi: false`, `app.config.ts` deja de registrar `HttpClientInMemoryWebApiModule` y todas las
llamadas de `HttpClient` salen de verdad por la red hacia `apiBaseUrl`. No hace falta tocar ningún
componente ni servicio de aplicación — solo hablan con las clases `*ApiService`, que ya usan
`environment.apiBaseUrl`.

Vuelve a compilar y desplegar `stockia-webapp` (o simplemente `npm start` en local) para probarlo contra la
API real desplegada en vez de la fake API embebida.
