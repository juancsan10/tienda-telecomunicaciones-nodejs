import { Request, Response, NextFunction } from 'express';
import * as service from '../services/product.service';
import { createProductSchema, updateProductSchema, idParamSchema } from '../schemas/product.schema';

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
    res.status(400).json({ message: 'Validation error', issues: result.error.issues });
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
    res.status(400).json({ message: 'Validation error', issues: paramsResult.error.issues });
    return;
  }

  const result = updateProductSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: 'Validation error', issues: result.error.issues });
    return;
  }

  try {
    const product = await service.update(paramsResult.data.id, result.data);
    res.json({ data: product });
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
