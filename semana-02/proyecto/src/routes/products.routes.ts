import { Router } from 'express';
import * as store from '../store.js';
import type { CreateProductDto, UpdateProductDto } from '../types.js';

export const productsRouter = Router();

productsRouter.get('/', (_req, res) => {
  res.json(store.getAll());
});

productsRouter.get('/:id', (req, res) => {
  const product = store.getById(Number(req.params.id));
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json(product);
});

productsRouter.post('/', (req, res) => {
  const dto = req.body as CreateProductDto;

  if (!dto.name || !dto.category || dto.price === undefined) {
    res.status(400).json({ error: 'name, category y price son requeridos' });
    return;
  }

  const newProduct = store.create({
    name: dto.name,
    category: dto.category,
    price: dto.price,
    stock: dto.stock ?? 0,
    active: dto.active ?? true,
  });
  res.status(201).json(newProduct);
});

productsRouter.put('/:id', (req, res) => {
  const dto = req.body as UpdateProductDto;
  const updated = store.update(Number(req.params.id), dto);

  if (!updated) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json(updated);
});

productsRouter.delete('/:id', (req, res) => {
  const removed = store.remove(Number(req.params.id));

  if (!removed) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.status(204).send();
});
