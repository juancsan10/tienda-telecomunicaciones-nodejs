# API REST con Arquitectura en Capas — Tienda de Telecomunicaciones (Semana 03)

## Descripción

API REST con Express 5 + TypeScript que gestiona el catálogo de una tienda
de telecomunicaciones, aplicando arquitectura en 4 capas:
`routes → controllers → services → repositories`.

## Dominio

**Recurso:** `Product`
**Categorías:** `planes`, `dispositivos`, `accesorios`, `lineas`

## Arquitectura

| Capa | Responsabilidad |
|------|------------------|
| `routes/` | Mapeo URL + método HTTP → función del controller |
| `controllers/` | Extraer datos de `req`, llamar al service, responder |
| `services/` | Lógica de negocio y paginación (sin imports de Express) |
| `repositories/` | Único punto de acceso al store, siempre `async` |

## Endpoints

| Método | Ruta | Status | Descripción |
|--------|------|:---:|-------------|
| GET | `/api/v1/products?page&limit` | 200 | Listar con paginación |
| GET | `/api/v1/products/:id` | 200 | Obtener por ID |
| POST | `/api/v1/products` | 201 | Crear |
| PUT | `/api/v1/products/:id` | 200 | Actualizar |
| DELETE | `/api/v1/products/:id` | 204 | Eliminar |

## Contratos de respuesta

```json
// GET /products?page=1&limit=5 → 200
{ "data": [...], "total": 5, "page": 1, "limit": 5 }

// GET /products/1 → 200
{ "data": { "id": 1, "name": "Plan Ilimitado 20GB", ... } }

// GET /products/999 → 404
{ "error": "Not Found", "message": "Product 999 not found" }
```

## Cómo ejecutar

```bash
pnpm install
cp .env.example .env
pnpm dev
pnpm build
```
