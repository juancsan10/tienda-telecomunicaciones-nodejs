# API con Validación, Errores y Logging — Tienda de Telecomunicaciones (Semana 04)

## Descripción

API REST con Express 5 + TypeScript que integra validación con **Zod**,
manejo estructurado de errores con **AppError**, y logging profesional
con **Winston + Morgan**, sobre el dominio de una tienda de telecomunicaciones.

## Dominio

**Recurso:** `Product`
**Categorías válidas:** `planes`, `dispositivos`, `accesorios`, `lineas`

## Schema de validación (Zod)

```ts
{
  name: string (requerido, min 1 caracter),
  category: 'planes' | 'dispositivos' | 'accesorios' | 'lineas',
  price: number (positivo),
  stock: number (entero, no negativo, default 0),
  active: boolean (default true),
}
```
`updateProductSchema` reutiliza el mismo schema con `.partial()` (todos los campos opcionales).

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/products?page&limit` | Listar con paginación |
| GET | `/api/v1/products/:id` | Obtener por ID (valida que sea numérico) |
| POST | `/api/v1/products` | Crear (valida con Zod, 400 si falla) |
| PUT | `/api/v1/products/:id` | Actualizar parcial |
| DELETE | `/api/v1/products/:id` | Eliminar |
| GET | `/health` | Health check |

## Manejo de errores

| Situación | Status | Respuesta |
|---|:---:|---|
| Body inválido en POST/PUT | 400 | `{ error, message, issues: [...] }` |
| `:id` no numérico | 400 | `{ error, message, issues: [...] }` |
| Producto no encontrado | 404 | `{ error, message }` (vía `AppError`) |
| Ruta inexistente | 404 | `{ error, message }` JSON |
| Error inesperado | 500 | `{ error, message }` (stack solo en dev) |

## Cómo ejecutar

```bash
pnpm install
cp .env.example .env
pnpm dev
pnpm build
```
