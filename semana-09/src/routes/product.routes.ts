import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  getAllHandler,
  getByIdHandler,
  createHandler,
  updateHandler,
  deleteHandler,
} from '../controllers/product.controller.js';

// ============================================================
// PRODUCTS ROUTER — Tienda de Telecomunicaciones
// ============================================================
// GET público (catálogo visible sin cuenta), el resto autenticado.
// ============================================================

export const productRouter = Router();

productRouter.get('/', getAllHandler);
productRouter.get('/:id', getByIdHandler);
productRouter.post('/', authenticate, createHandler);
productRouter.put('/:id', authenticate, updateHandler);
productRouter.delete('/:id', authenticate, deleteHandler);
