import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import * as productService from '../services/product.service.js';
import { createProductSchema, updateProductSchema, productIdSchema } from '../validators/product.schema.js';

export async function getAllHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const products = await productService.getAll();
    res.status(200).json({ data: products, total: products.length });
  } catch (err) {
    next(err);
  }
}

export async function getByIdHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { params } = productIdSchema.parse({ params: req.params });
    const product = await productService.getById(params.id);
    res.status(200).json({ data: product });
  } catch (err) {
    if (err instanceof ZodError) return next(err);
    next(err);
  }
}

export async function createHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { body } = createProductSchema.parse({ body: req.body });
    const user = res.locals['user'] as { sub: string };
    const product = await productService.create(body, user.sub);
    res.status(201).json({ data: product });
  } catch (err) {
    if (err instanceof ZodError) return next(err);
    next(err);
  }
}

export async function updateHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { params } = productIdSchema.parse({ params: req.params });
    const { body } = updateProductSchema.parse({ body: req.body });
    const user = res.locals['user'] as { sub: string; role: string };
    const product = await productService.update(params.id, body, user.sub, user.role);
    res.status(200).json({ data: product });
  } catch (err) {
    if (err instanceof ZodError) return next(err);
    next(err);
  }
}

export async function deleteHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { params } = productIdSchema.parse({ params: req.params });
    const user = res.locals['user'] as { sub: string; role: string };
    await productService.remove(params.id, user.sub, user.role);
    res.status(204).send();
  } catch (err) {
    if (err instanceof ZodError) return next(err);
    next(err);
  }
}
