// ============================================
// CONTROLLER — Interfaz HTTP (thin controller)
// ============================================
import { Request, Response, NextFunction } from 'express';
import * as service from '../services/products.service';
import { CreateProductDto, UpdateProductDto, ErrorResponse } from '../types';

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = await service.findAll({ page, limit });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    const product = await service.findById(id);
    if (!product) {
      const error: ErrorResponse = { error: 'Not Found', message: `Product ${id} not found` };
      res.status(404).json(error);
      return;
    }
    res.json({ data: product });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = req.body as CreateProductDto;

    if (!dto.name || !dto.category || dto.price === undefined) {
      const error: ErrorResponse = { error: 'Bad Request', message: 'name, category y price son requeridos' };
      res.status(400).json(error);
      return;
    }

    const product = await service.create({
      name: dto.name,
      category: dto.category,
      price: dto.price,
      stock: dto.stock ?? 0,
      active: dto.active ?? true,
    });
    res.status(201).json({ data: product });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    const dto = req.body as UpdateProductDto;
    const updated = await service.update(id, dto);
    if (!updated) {
      const error: ErrorResponse = { error: 'Not Found', message: `Product ${id} not found` };
      res.status(404).json(error);
      return;
    }
    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    const removed = await service.remove(id);
    if (!removed) {
      const error: ErrorResponse = { error: 'Not Found', message: `Product ${id} not found` };
      res.status(404).json(error);
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
