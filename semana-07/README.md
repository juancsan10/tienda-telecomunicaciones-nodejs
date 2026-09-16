# API con Autenticación JWT — Tienda de Telecomunicaciones (Semana 07)

## Descripción

API REST con Express 5 + TypeScript + MongoDB, con sistema de autenticación
completo (bcrypt + JWT access/refresh tokens en cookies HttpOnly) protegiendo
el CRUD del catálogo de productos.

## Dominio

**Recurso principal:** `Product` (tienda de telecomunicaciones)
**Categorías:** `planes`, `dispositivos`, `accesorios`, `lineas`
**Campo `addedBy`:** referencia al `User` que creó el producto

## Autenticación

| Endpoint | Auth | Descripción |
|---|:---:|---|
| `POST /api/v1/auth/register` | Pública | Registro con hash bcrypt (salt rounds 10) |
| `POST /api/v1/auth/login` | Pública | Emite access (15m) + refresh (7d) token en cookies HttpOnly |
| `GET /api/v1/auth/me` | 🔒 | Perfil del usuario autenticado |
| `POST /api/v1/auth/refresh` | Pública (usa cookie) | Rota el refresh token |
| `POST /api/v1/auth/logout` | 🔒 | Invalida refresh token en DB y limpia cookies |

## CRUD de Productos (todas las rutas protegidas)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/products?page&limit` | Listar con paginación |
| GET | `/api/v1/products/:id` | Obtener por ID |
| POST | `/api/v1/products` | Crear (queda asociado al usuario autenticado) |
| PATCH | `/api/v1/products/:id` | Actualizar parcial |
| DELETE | `/api/v1/products/:id` | Eliminar |

## Seguridad implementada

- Contraseñas hasheadas con `bcrypt.hash()`, salt rounds = 10
- `JWT_ACCESS_SECRET` y `JWT_REFRESH_SECRET` distintos, cargados desde `.env`
- Tokens en cookies `httpOnly`, `secure` (en producción), `sameSite: 'lax'`
- Refresh token almacenado como **hash** en la base de datos, nunca en claro
- Rotación de refresh token en cada `/refresh`
- Mismo mensaje de error para email inexistente y contraseña incorrecta (previene user enumeration)
- `password` y `refreshToken` con `select: false` en el schema de Mongoose

## Cómo ejecutar

```bash
docker compose up -d
pnpm install
cp .env.example .env
# Genera los secretos:
# openssl rand -base64 64  →  JWT_ACCESS_SECRET
# openssl rand -base64 64  →  JWT_REFRESH_SECRET
pnpm dev
```

## Flujo de prueba sugerido (Thunder Client / Postman)

1. `POST /api/v1/auth/register` → crear usuario
2. `POST /api/v1/auth/login` → verificar que llegan cookies `accessToken` y `refreshToken`
3. `GET /api/v1/products` sin cookie → debe dar 401
4. `POST /api/v1/products` con cookie → crear producto (201)
5. `GET /api/v1/products/:id`, `PATCH`, `DELETE` → CRUD completo
6. `POST /api/v1/auth/refresh` → confirmar que llega un `accessToken` nuevo
7. `POST /api/v1/auth/logout` → luego intenta `refresh` de nuevo → debe dar 401
