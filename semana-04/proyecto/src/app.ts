import express from 'express';
import { productsRouter } from './routes/products.routes';
import { notFound } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';
import { morganMiddleware } from './config/logger';

const app = express();

app.use(express.json());
app.use(morganMiddleware);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', week: '04', project: 'tienda-telecom-api-validacion' });
});

app.use('/api/v1/products', productsRouter);

// Orden correcto: 404 antes del error handler, error handler siempre al final
app.use(notFound);
app.use(errorHandler);

export default app;
