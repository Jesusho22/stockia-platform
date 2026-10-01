import jsonServer from 'json-server';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = process.env.JSON_SERVER_DB_PATH || path.join(__dirname, 'db.json');

if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({}, null, 2));
}
console.log('>> Using DB:', DB_PATH);

const server = jsonServer.create();
const router = jsonServer.router(DB_PATH);
const middlewares = jsonServer.defaults();

server.use(cors());
server.use(middlewares);
server.use(jsonServer.bodyParser);

server.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Todas las rutas del frontend usan el prefijo /api/v1 (ver environment.apiBaseUrl
// en stockia-webapp); json-server expone los recursos sin prefijo, así que lo
// reescribimos aquí — mismo patrón que qullqa-mock-api.
server.use(jsonServer.rewriter({
  '/api/v1/*': '/$1',
  '/api/v1': '/',
}));

server.get('/', (_req, res) => {
  const state = typeof router.db.getState === 'function' ? router.db.getState() : router.db.data;
  res.json({ service: 'stockia-mock-api', resources: Object.keys(state || {}) });
});

server.use(router);

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`StockIA Mock API corriendo en http://localhost:${port}`));
