# API CRUD — Tienda de Telecomunicaciones (Semana 02)

## Descripción

API REST con Express 5 + TypeScript que gestiona el catálogo de una tienda
de telecomunicaciones (planes, dispositivos, accesorios y líneas) usando un
store en memoria (sin base de datos aún).

## Dominio

**Recurso:** `Product`
**Categorías:** `planes`, `dispositivos`, `accesorios`, `lineas`

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/products` | Listar todos |
| GET | `/api/v1/products/:id` | Obtener por ID |
| POST | `/api/v1/products` | Crear |
| PUT | `/api/v1/products/:id` | Actualizar |
| DELETE | `/api/v1/products/:id` | Eliminar |
| GET | `/health` | Health check |

## Cómo ejecutar

```bash
pnpm install
cp .env.example .env
pnpm dev
```

## Middlewares

- `express.json()` — parseo de body
- Logger personalizado — método, ruta, status, duración
- Handler 404 para rutas no encontradas
- Error handler global (4 parámetros, siempre al final)
