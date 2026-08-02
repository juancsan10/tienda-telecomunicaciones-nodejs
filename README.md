# Procesador de Datos — Tienda de Telecomunicaciones

## Descripción

CLI en Node.js + TypeScript que procesa el catálogo de una tienda de
telecomunicaciones (planes, dispositivos, accesorios y líneas). Lee
`data/productos.json`, calcula un resumen del inventario, permite filtrar
por categoría y genera un reporte en `output/report.json`.

Proyecto semanal — Semana 01 (Node.js Fundamentals) del bootcamp
[bc-expressjs](https://github.com/ergrato-dev/bc-expressjs).

## Dominio

**Recurso principal:** `Product`
**Categorías:** `planes`, `dispositivos`, `accesorios`, `lineas`

## Cómo ejecutar

```bash
pnpm install
pnpm dev                              # sin filtro
pnpm dev -- --category dispositivos   # filtrado por categoría
pnpm build                            # verifica compilación TypeScript
```

## Funcionalidades

- Lectura async de `productos.json` con `fs/promises`
- Resumen: total, activos/inactivos, precio promedio, más caro/más barato
- Filtro por categoría vía `--category`
- Reporte escrito en `output/report.json`
- Manejo de errores: archivo no encontrado y categoría inexistente
