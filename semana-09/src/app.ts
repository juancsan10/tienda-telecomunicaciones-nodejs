import express from 'express';
import helmet from 'helmet';
import { authRouter } from './routes/auth.routes.js';
import { productRouter } from './routes/product.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

// ============================================================
// app.ts — configuración de Express SIN app.listen()
// ============================================================
// Importar { app } en los tests — NUNCA server.ts
// ============================================================

export const app = express();

app.use(helmet());
app.use(express.json());

app.use('/api/v1/auth', authRouter);

// Dominio: Tienda de Telecomunicaciones (mismo dominio de semanas 05-08)
app.use('/api/v1/products', productRouter);

app.get('/api/v1/health', (_req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);
