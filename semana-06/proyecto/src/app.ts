import express from 'express';
import { categoryRouter } from './routes/category.routes';
import { productRouter } from './routes/product.routes';
import { notFound } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';

export const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', week: '06', project: 'tienda-telecom-api-mongo' });
});

app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/products', productRouter);

app.use(notFound);
app.use(errorHandler);
