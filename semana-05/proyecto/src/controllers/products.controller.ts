import { Request, Response, NextFunction } from 'express';
import * as service from '../services/products.service';
import {
  createProductSchema,
  updateProductSchema,
  idParamSchema,
} from '../schemas/products.schema';

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 10;
    const result = await service.findAll(page, limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = idParamSchema.parse(req.params);
    const product = await service.findById(id);
    res.json({ data: product });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  const result = createProductSchema.safeParse(req.body);
  if (!result.success) {
    next(result.error);
    return;
  }

  try {
    const product = await service.create(result.data);
    res.status(201).json({ data: product });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  const paramsResult = idParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    next(paramsResult.error);
    return;
  }

  const bodyResult = updateProductSchema.safeParse(req.body);
  if (!bodyResult.success) {
    next(bodyResult.error);
    return;
  }

  try {
    const updated = await service.update(paramsResult.data.id, bodyResult.data);
    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = idParamSchema.parse(req.params);
    await service.remove(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
