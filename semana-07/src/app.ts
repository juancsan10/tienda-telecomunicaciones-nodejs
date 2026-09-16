import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes';
import productRouter from './routes/resource.routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';

export const app = express();

app.use(express.json());
app.use(cookieParser());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', week: '07', project: 'tienda-telecom-api-jwt' });
});

// Rutas de autenticación
app.use('/api/v1/auth', authRouter);

// Recurso principal del dominio: tienda de telecomunicaciones
app.use('/api/v1/products', productRouter);

// Middlewares de errores (siempre al final)
app.use(notFound);
app.use(errorHandler);
