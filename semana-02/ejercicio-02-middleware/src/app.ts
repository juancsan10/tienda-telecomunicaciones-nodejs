import express from 'express';
import type { Application } from 'express';
import { logger } from './middlewares/logger.js';
import { auth } from './middlewares/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';

interface Item { id: number; name: string; }
const items: Item[] = [
  { id: 1, name: 'item de ejemplo' },
];

export function createApp(): Application {
  const app = express();

  app.use(express.json());
  app.use(logger);
  app.use(auth);

  app.get('/api/v1/items', (_req, res) => { res.json(items); });
  app.post('/api/v1/items', (req, res) => {
    const newItem: Item = { id: items.length + 1, name: req.body.name as string };
    items.push(newItem);
    res.status(201).json(newItem);
  });

  app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

  app.use(errorHandler);

  return app;
}
