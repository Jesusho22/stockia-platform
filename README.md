# StockIA — Web Application Platform

Frontend de la Web Application de **StockIA** (equipo DataBit, proyecto académico StockIA / DataBite Corp) más
su API simulada, siguiendo la misma arquitectura DDD-por-Bounded-Context de referencia del curso (Qullqa /
equipo Flowbit).

Este repo tiene dos partes independientes:

```
stockia-platform/
├── webapp/      # Angular 18 standalone — frontend de la Web Application
└── mock-api/    # json-server — API REST simulada (db.json editable)
```

## Correr todo en local

**Opción rápida (sin levantar la mock-api aparte):** el frontend ya trae una fake API embebida en el propio
navegador (`angular-in-memory-web-api`), activada por defecto.

```bash
cd webapp
npm install
npm start
# http://localhost:4200
```

**Opción con la API real simulada (json-server), igual que Qullqa:**

```bash
# Terminal 1
cd mock-api
npm install
npm start
# http://localhost:3000

# Terminal 2
cd webapp
npm install
npm start
```
Y en `webapp/src/environments/environment.ts`, pon `useFakeApi: false` y `apiBaseUrl: 'http://localhost:3000/api/v1'`.

## Funcionalidades (User Stories del Capítulo III)

| Módulo | Funcionalidad |
|---|---|
| Autenticación | Registro, login, editar mi perfil (US29, US30, US32) |
| Equipo | Invitar integrantes, asignar roles, dar de baja (US23, US33) |
| Inventario | CRUD de insumos, vida útil (US19, US22) |
| Recetas | Crear, editar, eliminar recetas vinculadas al inventario (US20, US34) |
| Ventas | Registrar venta (valida stock), historial, anular venta (US27, US35) |
| Predicción de demanda | Generar proyección de 7 días con IA simulada (US24) |
| Alertas | CRUD completo de alertas, entrega multicanal para críticas, reintento de entrega (US26, US28) |
| Recomendaciones | Aplicar recomendaciones automáticas de menú/compras (US25) |
| Planes | Elegir/cambiar plan con Stripe/PayPal simulado (US31) |

## Documentación

- [`webapp/README.md`](./webapp/README.md) — arquitectura DDD del frontend, cómo correrlo, cómo conectar un backend real.
- [`webapp/DEPLOY-VERCEL.md`](./webapp/DEPLOY-VERCEL.md) — desplegar el frontend en Vercel.
- [`mock-api/README.md`](./mock-api/README.md) — cómo editar los datos de ejemplo (`db.json`) y los endpoints disponibles.
- [`mock-api/DEPLOY.md`](./mock-api/DEPLOY.md) — desplegar la mock API (Render recomendado) y conectarla al frontend.

## Stack

- **Frontend:** Angular 18 (standalone components, signals), arquitectura DDD por Bounded Context.
- **Fake API embebida:** `angular-in-memory-web-api`.
- **Mock API standalone:** `json-server` + `cors` (mismo patrón que `qullqa-mock-api`).
