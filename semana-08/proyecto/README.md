# API Segura con RBAC — Tienda de Telecomunicaciones (Semana 08)

## Descripción

API REST con Express 5 + TypeScript + MongoDB, con autenticación JWT,
autorización basada en roles (RBAC) y capas de seguridad completas
(Helmet, CORS con whitelist, rate limiting, sanitización de inputs).

## Dominio

**Recurso principal:** `Product` (tienda de telecomunicaciones)
**Categorías:** `planes`, `dispositivos`, `accesorios`, `lineas`

## Roles y permisos

| Rol | Puede |
|---|---|
| Público (sin token) | Ver el catálogo (`GET /products`, `GET /products/:id`) |
| `user` | Todo lo anterior + crear productos + editar los que él mismo creó |
| `admin` | Todo lo anterior + editar cualquier producto + eliminar productos + ver dashboard de usuarios |

## Endpoints

### Auth (`/api/v1/auth`)
| Método | Ruta | Acceso |
|---|---|---|
| POST | `/register` | Público (rate-limited: 5/15min) |
| POST | `/login` | Público (rate-limited: 5/15min) |
| POST | `/refresh` | Público (usa cookie) |
| GET | `/me` | 🔒 Autenticado |
| POST | `/logout` | 🔒 Autenticado |

### Productos (`/api/v1/products`)
| Método | Ruta | Acceso |
|---|---|---|
| GET | `/` | Público |
| GET | `/:id` | Público |
| POST | `/` | 🔒 Autenticado |
| PATCH | `/:id` | 🔒 Dueño del producto o `admin` |
| DELETE | `/:id` | 🔒 Solo `admin` |

## Capas de seguridad aplicadas

- **Helmet**: cabeceras de seguridad HTTP (`X-Content-Type-Options`, CSP, etc.)
- **CORS con whitelist**: solo `http://localhost:5173` y `http://localhost:3001` (no `*`)
- **Rate limiting global**: 100 requests / 15 min en toda la API
- **Rate limiting en auth**: 5 requests / 15 min en `/register` y `/login` (protección fuerza bruta)
- **express-mongo-sanitize**: elimina operadores Mongo (`$gt`, `$ne`, etc.) del body/query
- **Contraseñas hasheadas**: `bcrypt.hash()` con salt rounds 12
- **Secretos JWT distintos**: `JWT_ACCESS_SECRET` ≠ `JWT_REFRESH_SECRET`, ambos en `.env`
- **Errores sin stack trace**: el `errorHandler` solo expone `{ error: message }`, nunca el stack

## Cómo ejecutar

```bash
docker compose up -d
pnpm install
cp .env.example .env
pnpm dev
```

Al arrancar por primera vez se crean 2 usuarios de prueba automáticamente:
- `user@test.com` / `User1234!` (rol `user`)
- `admin@test.com` / `Admin1234!` (rol `admin`)

## Flujo de prueba sugerido

1. `POST /auth/login` con `user@test.com` → guarda el `accessToken` de la respuesta
2. `GET /products` sin header → funciona (es público)
3. `POST /products` con `Authorization: Bearer <token>` → crea un producto (201)
4. `DELETE /products/:id` con el token de `user` → debe dar 403 (no es admin)
5. Repite login con `admin@test.com` y prueba `DELETE` de nuevo → 204
6. Excede 5 intentos de login seguidos → 429 en el sexto intento
