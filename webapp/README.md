# StockIA — Web Application (Frontend, Angular)

Frontend de la Web Application de **StockIA** (DataBite Corp — equipo DataBit, 1ASI0729), construido en Angular 18
standalone, siguiendo la misma arquitectura DDD por Bounded Context que `qullqa-webapp`
(`upc-pre-202610-1asi0730-17953-flowbit`), adaptada a los User Stories y al modelo de dominio de StockIA
(Capítulo III y Capítulo IV del informe).

**Este repo es SOLO frontend.** No incluye backend real: por defecto, todas las peticiones HTTP van a la mock
API desplegada en Render — **https://stockia-mock-api.onrender.com/api/v1** (repo
[`stockia-mock-api`](../mock-api), `json-server`). También existe una fake API embebida en el propio navegador
(`angular-in-memory-web-api`, ver `src/app/fake-api/in-memory-data.service.ts`) para correr sin conexión;
actívala con `useFakeApi: true` en `src/environments/environment.ts`.

## Arquitectura (DDD por Bounded Context)

```
src/app/
├── shared/presentation/shell/        # Layout (sidebar + topbar)
├── iam/                               # User & Access Management
│   ├── domain/                        # User, UserRole
│   ├── application/                   # AuthService (sesión, signals)
│   ├── infrastructure/                # IamApiService, guards
│   └── presentation/                  # sign-in, sign-up, roles-list
├── product-inventory/                 # Inventory & Recipe Management
│   ├── domain/                        # InventoryItem (Aggregate Root), Recipe
│   ├── application/                   # InventoryService
│   ├── infrastructure/                # InventoryApiService
│   └── presentation/                  # inventory-list, recipe-list
├── demand-forecasting/                # Demand Forecasting
├── alerts/                            # Alerts & Recommendations
├── subscription/                      # Subscription & Billing
├── dashboard/                         # Dashboard & Analytics
└── fake-api/                          # InMemoryDataService (fake API)
```

Cada contexto separa **domain** (clases planas, sin Angular ni HTTP), **application** (servicios con estado
reactivo vía `signal()`, equivalentes a las stores Pinia de Qullqa), **infrastructure** (el único lugar que
conoce `HttpClient`) y **presentation** (componentes standalone).

## Funcionalidades implementadas (User Stories del Capítulo III)

| US | Funcionalidad | Pantalla |
|---|---|---|
| US29 / US30 | Registro e inicio de sesión | `/auth/sign-up`, `/auth/sign-in` |
| US19 | Gestionar inventario (alta/baja/edición) | `/app/inventory` |
| US20 | Recetas vinculadas al inventario con descuento automático | `/app/recipes` (botón "Simular venta") |
| US21 | Dashboard operativo con alertas y métricas | `/app/dashboard` |
| US22 | Vida útil de insumos (catálogo interno, sin API externa) | `/app/inventory` (campo "Vida útil") |
| US23 | Roles y permisos (Administrador / Empleado) | `/app/roles` |
| US24 | Predicción de demanda con IA | `/app/forecast` |
| US25 | Recomendaciones automáticas de menú/compras | `/app/recommendations` |
| US26 / US28 | Alertas de stock e insumos por WhatsApp/correo | `/app/alerts` |
| US31 | Planes y suscripción (Stripe/PayPal simulado) | `/app/plans` |

No se tocó nada de backend real ni de infraestructura de despliegue del software — solo frontend y fake API, tal
como se pidió.

## Correr en local

```bash
npm install
npm start      # http://localhost:4200 — habla con https://stockia-mock-api.onrender.com por defecto
```

Nota: el plan gratuito de Render "duerme" la mock API tras ~15 min sin tráfico; el primer request tras dormir
puede tardar unos segundos en responder mientras despierta.

Credenciales de prueba (ya precargadas en el formulario de login):
- **Administrador:** `admin@databitecorp.com` / `stockia123`
- **Empleado:** `empleado@databitecorp.com` / `stockia123` (usar "Iniciar sesión" manualmente con estos datos)

## Conectar el backend real más adelante

1. En `src/app/app.config.ts`, quita el bloque `...(environment.useFakeApi ? [...] : [])` (o pon
   `useFakeApi: false` en `src/environments/environment.prod.ts`).
2. Cambia `apiBaseUrl` en `src/environments/environment*.ts` a la URL del backend real.
3. Ningún componente ni servicio de aplicación cambia: solo hablan con las clases `*ApiService` de la capa de
   infraestructura, que son las únicas que conocen la URL.

## Build de producción

```bash
npm run build
```

Genera los archivos estáticos en `dist/stockia-webapp/browser/`.

## Despliegue en Vercel

Ver `DEPLOY-VERCEL.md` en la raíz del proyecto para el paso a paso.
