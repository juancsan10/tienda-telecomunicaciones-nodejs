import { Router } from 'express';

interface Item {
  id: number;
  name: string;
}

const items: Item[] = [];

export const itemsRouter = Router();

itemsRouter.get('/', (_req, res) => {
  res.json(items);
});

itemsRouter.post('/', (req, res) => {
  const newItem: Item = {
    id: items.length + 1,
    name: req.body.name as string,
  };
  items.push(newItem);
  res.status(201).json(newItem);
});

itemsRouter.get('/:id', (req, res) => {
  const item = items.find((i) => i.id === Number(req.params.id));
  if (!item) {
    res.status(404).json({ error: 'Item not found' });
    return;
  }
  res.json(item);
});

itemsRouter.put('/:id', (req, res) => {
  const index = items.findIndex((i) => i.id === Number(req.params.id));
  if (index === -1) {
    res.status(404).json({ error: 'Item not found' });
    return;
  }
  items[index] = { ...items[index], name: req.body.name as string };
  res.json(items[index]);
});

itemsRouter.delete('/:id', (req, res) => {
  const index = items.findIndex((i) => i.id === Number(req.params.id));
  if (index === -1) {
    res.status(404).json({ error: 'Item not found' });
    return;
  }
  items.splice(index, 1);
  res.status(204).send();
});
