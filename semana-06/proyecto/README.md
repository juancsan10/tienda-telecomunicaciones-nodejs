# API REST con MongoDB + Mongoose — Tienda de Telecomunicaciones (Semana 06)

## Descripción

API REST con Express 5 + TypeScript + Mongoose sobre MongoDB, con dos
entidades relacionadas: `Category` (secundaria) y `Product` (principal,
con referencia `ObjectId` a `Category` vía `populate()`).

## Dominio

- **Entidad secundaria:** `Category` (planes, dispositivos, accesorios, lineas)
- **Entidad principal:** `Product` — referencia a `Category` mediante el campo `category: ObjectId`

## Endpoints

### Categories (`/api/v1/categories`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Listar todas |
| GET | `/:id` | Obtener por ID |
| POST | `/` | Crear |
| PUT | `/:id` | Actualizar |
| DELETE | `/:id` | Eliminar |

### Products (`/api/v1/products`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/?page&limit` | Listar con paginación + populate de category |
| GET | `/:id` | Obtener con populate de category |
| POST | `/` | Crear (valida que `category` sea un ObjectId válido) |
| PUT | `/:id` | Actualizar |
| DELETE | `/:id` | Eliminar |

## Manejo de errores

| Situación | Status |
|---|:---:|
| `CastError` (ID mal formado) | 400 |
| Duplicate key (`sku` o `name` repetido, código 11000) | 409 |
| Documento no encontrado | 404 |
| Body inválido (Zod) | 400 |

## Cómo ejecutar

```bash
docker compose up -d
pnpm install
cp .env.example .env
pnpm seed
pnpm dev
```
