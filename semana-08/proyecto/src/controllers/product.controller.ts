import { Request, Response, NextFunction } from 'express';
import * as service from '../services/product.service.js';
import { createProductSchema, updateProductSchema } from '../schemas/product.schema.js';
import { AppError } from '../errors/AppError.js';

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = await service.findAll(page, limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const product = await service.findById(req.params.id as string);
    res.json({ data: product });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { body } = createProductSchema.parse({ body: req.body });
    if (!req.user) throw new AppError(401, 'Not authenticated');
    const product = await service.create(body, req.user.sub);
    res.status(201).json({ data: product });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { body } = updateProductSchema.parse({ body: req.body });
    if (!req.user) throw new AppError(401, 'Not authenticated');
    const updated = await service.update(req.params.id as string, body, req.user.sub, req.user.role);
    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await service.remove(req.params.id as string);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
