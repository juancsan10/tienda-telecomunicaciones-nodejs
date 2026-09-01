# API con PostgreSQL y Prisma ORM — Tienda de Telecomunicaciones (Semana 05)

## Descripción

API REST con Express 5 + TypeScript + Prisma ORM sobre PostgreSQL, migrando
el almacenamiento en memoria de la semana 04 a una base de datos real, con
migraciones versionadas y seed de datos.

## Dominio

**Entidades:**
- `Product` (recurso principal): planes, dispositivos, accesorios, líneas
- `Category` (recurso secundario, relación 1:N): agrupa los productos

## Diagrama de entidades

```
Category (1) ──────< (N) Product
  id (uuid)              id (uuid)
  name (unique)          name
                         sku (unique)
                         price
                         stock
                         active
                         categoryId (FK)
```

## Endpoints

| Método | Ruta | Descripción | Status |
|--------|------|-------------|--------|
| GET | `/api/v1/products?page&limit` | Listado paginado con categoría incluida | 200 |
| GET | `/api/v1/products/:id` | Detalle con relación a categoría | 200 / 404 |
| POST | `/api/v1/products` | Crear (valida con Zod) | 201 / 400 / 409 |
| PUT | `/api/v1/products/:id` | Actualizar | 200 / 400 / 404 |
| DELETE | `/api/v1/products/:id` | Eliminar | 204 / 404 |

### Ejemplo de respuesta — GET /api/v1/products/:id

```json
{
  "data": {
    "id": "b3f1c2...-uuid",
    "name": "Plan Ilimitado 20GB",
    "sku": "PLAN-20GB",
    "price": 45.9,
    "stock": 500,
    "active": true,
    "categoryId": "a1e0...-uuid",
    "category": { "id": "a1e0...-uuid", "name": "planes" }
  }
}
```

## Manejo de errores Prisma

| Código Prisma | Situación | Respuesta |
|---|---|---|
| `P2025` | Registro no encontrado (get/update/delete) | 404 `{ error, message }` |
| `P2002` | Constraint único violado (ej. `sku` duplicado) | 409 `{ error, message }` |

## Cómo ejecutar

```bash
# 1. Levantar PostgreSQL
docker compose up -d

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp .env.example .env

# 4. Ejecutar migración
pnpm dlx prisma migrate dev --name init

# 5. Ejecutar seed
pnpm dlx prisma db seed

# 6. Iniciar servidor
pnpm dev
```
