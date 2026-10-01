# stockia-mock-api

API REST simulada (json-server) para el frontend de StockIA — mismo patrón que `qullqa-mock-api`
(equipo Flowbit): un `db.json` editable a mano como "base de datos", servido detrás de `/api/v1/*`.

**No es el backend real.** Reemplaza temporalmente al backend de StockIA mientras no existe (Sprint 2 en
adelante). El frontend (`stockia-webapp`) le habla por HTTP exactamente igual que le hablaría a un backend
real — cuando exista, solo hay que cambiar la URL en `environment.apiBaseUrl` del frontend.

## Editar los datos

Todo vive en `db.json`. Es un único archivo JSON con una clave por colección (recurso):

```
users, inventoryItems, recipes, demandForecasts, alerts, recommendations, plans, subscriptions, sales
```

Para agregar/editar/borrar datos de ejemplo, edita `db.json` directamente con cualquier editor de texto y
guarda — json-server lee el archivo en cada arranque (si el servidor ya está corriendo con `npm start`,
reinícialo para que tome los cambios; **ojo:** si el servidor está corriendo, cada POST/PUT/DELETE desde el
frontend también reescribe este archivo en vivo).

## Correr en local

```bash
npm install
npm start
```

Por defecto corre en `http://localhost:3000`. Pruébalo:

```bash
curl http://localhost:3000/api/v1/health
curl http://localhost:3000/api/v1/users
curl http://localhost:3000/api/v1/inventoryItems
```

## Endpoints

Cada colección de `db.json` queda expuesta como un recurso REST estándar bajo `/api/v1/<recurso>`:

| Método | URL | Acción |
|---|---|---|
| GET | `/api/v1/<recurso>` | Listar todos |
| GET | `/api/v1/<recurso>/:id` | Obtener uno |
| POST | `/api/v1/<recurso>` | Crear |
| PUT | `/api/v1/<recurso>/:id` | Reemplazar completo |
| PATCH | `/api/v1/<recurso>/:id` | Actualizar parcial |
| DELETE | `/api/v1/<recurso>/:id` | Eliminar |

(A diferencia del fake API anterior dentro del navegador —`angular-in-memory-web-api`—, **este sí soporta
PATCH**. No es obligatorio cambiar el frontend para usar PATCH, pero ya no hace falta evitarlo.)

Filtros útiles de json-server (funcionan tal cual): `?_sort=id&_order=desc`, `?_page=1&_limit=10`,
`?campo=valor` (filtro exacto), `?campo_like=texto` (contiene).

## Desplegarlo — ver `DEPLOY.md`

Instrucciones completas en [`DEPLOY.md`](./DEPLOY.md) (opción recomendada: Render, gratis y con persistencia
real; alternativa: Vercel, con la limitación de que no persiste escrituras entre invocaciones).
