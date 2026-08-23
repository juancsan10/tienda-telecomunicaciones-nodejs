import express from 'express';
import type { Application, Request, Response, NextFunction } from 'express';
import { productsRouter } from './routes/products.routes.js';

export function createApp(): Application {
  const app = express();

  app.use(express.json());

  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[${req.method}] ${req.url} → ${res.statusCode} (${duration}ms)`);
    });
    next();
  });

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/v1/products', productsRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(`[ERROR] ${err.message}`);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}
