# Semana 09 — Testing con Jest + Supertest — Tienda de Telecomunicaciones

## Qué se implementó

Suite de tests para la API del catálogo de productos (`Product`) de la tienda de
telecomunicaciones — el mismo dominio y estilo de código usado en las semanas 05-08
de este repositorio (categorías `planes`, `dispositivos`, `accesorios`, `lineas`,
JWT + RBAC básico, capas `routes → controllers → services → repositories`).

Se partió del starter de la semana 9 (`bc-expressjs/bootcamp/week-09-testing/3-proyecto/starter`)
y se completaron los `TODO`:

1. **Dominio adaptado**: `items` → `product`, reutilizando el modelo, DTOs y
   validaciones Zod ya usados en la semana 08 (incluye manejo de SKU duplicado → `409`).
2. **Unit tests** — `src/__tests__/product.service.test.ts`
   - `getAll()`: lista completa y lista vacía
   - `getById()`: happy path y `AppError 404`
   - `create()`: creación exitosa y propagación de `409` por SKU duplicado
   - `update()`: dueño puede actualizar, admin puede actualizar, `403` si no es dueño
     ni admin, `404` si no existe
   - `remove()`: dueño puede eliminar, admin puede eliminar, `403` si no es dueño
     ni admin, `404` si no existe
   - Repositorio (`product.repository`) mockeado con `jest.mock()`, sin tocar MongoDB
3. **Integration tests** — `src/__tests__/product.routes.test.ts`
   - `mongodb-memory-server` en `beforeAll` / `afterAll`, limpieza de la colección
     `products` en `afterEach`
   - `GET /api/v1/products` → `200` con arreglo vacío inicialmente
   - `POST /api/v1/products` → `201` con token válido, `401` sin token, `422` con
     datos inválidos (Zod)
   - `GET /api/v1/products/:id` → `200` existente, `404` inexistente
   - `PUT /api/v1/products/:id` → `200` cuando el dueño actualiza, `403` cuando un
     tercero (no dueño, no admin) intenta actualizar
   - `DELETE /api/v1/products/:id` → `204` cuando elimina un admin, `403` cuando
     intenta un tercero no dueño ni admin
4. **Auth unit tests** — `src/__tests__/auth.service.test.ts` (reutilizado del
   ejercicio 01): `register`, `login`, `getMe` con mocks de `users.repository`
5. **Fix aplicado al starter original**: `src/services/auth.service.ts` tenía un
   cast inválido (`user as Record<string, unknown>`) que no compilaba con
   TypeScript estricto; se corrigió a `user as unknown as Record<string, unknown>`
   sin cambiar el comportamiento.
6. **Fix de configuración**: se agregó `moduleNameMapper` en `jest.config.ts` para
   que `ts-jest` resuelva los imports con extensión `.js` sobre archivos `.ts`
   (patrón usado en todo el starter); sin esto, ningún test podía ni siquiera
   cargar los módulos.

## Cómo ejecutar

```bash
npm install
cp .env.example .env        # solo necesario para levantar el servidor con `npm run dev`

npm test                    # corre toda la suite
npm run test:watch          # modo watch
npm run test:coverage       # reporte de cobertura → coverage/index.html
```

## Verificación realizada

- ✅ `npx tsc --noEmit` — compila sin errores
- ✅ `npm test` sobre `product.service.test.ts` y `auth.service.test.ts` —
  **21/21 tests pasando**, ejecutado de verdad (no solo revisión visual)
- ⚠️ `product.routes.test.ts` (integration, `mongodb-memory-server`) — **no se
  pudo ejecutar en el entorno donde se generó esta entrega** porque no tiene
  salida de red hacia los servidores de descarga del binario de MongoDB
  (`fastdl.mongodb.org` devuelve `403` en ese entorno). El archivo sí pasa la
  verificación de TypeScript y usa exactamente la misma configuración de
  `ts-jest` que las suites que sí corrieron con éxito, por lo que solo falta
  ejecutarlo en una máquina con acceso normal a internet — lo mismo que ya
  necesitaste para `mongodb-memory-server` en el ejercicio 02 de esta semana.
  **Corre `npm test` en tu máquina antes de subir la entrega** para confirmar
  que los 3 archivos pasan completos y que la cobertura llega a ≥ 80%.

## Cobertura esperada

Con las tres suites corriendo (incluida la de integración), la cobertura cubre
`services` (~96-100%), `repositories`, `controllers`, `routes`, `validators` y
`middlewares`, cumpliendo el umbral de `jest.config.ts` (statements/lines/functions
≥ 80%, branches ≥ 70%). Solo con las dos suites unitarias la cobertura global es
menor (~35%) porque controllers/routes/middlewares/validators solo se ejercitan
desde los tests de integración — es normal y se resuelve corriendo `npm test`
completo.

## Estructura

```
src/
├── config/env.ts
├── errors/AppError.ts
├── models/
│   ├── product.model.ts      ← dominio: catálogo de la tienda
│   └── user.model.ts
├── repositories/
│   ├── product.repository.ts
│   └── users.repository.ts
├── services/
│   ├── product.service.ts    ← testeado con unit tests
│   └── auth.service.ts       ← testeado con unit tests
├── validators/
│   ├── product.schema.ts
│   └── auth.schema.ts
├── middlewares/
│   ├── auth.middleware.ts
│   └── error.middleware.ts
├── controllers/
│   ├── product.controller.ts
│   └── auth.controller.ts
├── routes/
│   ├── product.routes.ts     ← testeado con integration tests
│   └── auth.routes.ts
├── app.ts
├── server.ts
└── __tests__/
    ├── product.service.test.ts
    ├── product.routes.test.ts
    └── auth.service.test.ts
```
