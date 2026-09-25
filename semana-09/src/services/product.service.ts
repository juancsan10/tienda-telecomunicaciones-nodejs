import { AppError } from '../errors/AppError.js';
import type { CreateProductDto, UpdateProductDto } from '../types/index.js';
import type { IProduct } from '../models/product.model.js';
import * as productRepo from '../repositories/product.repository.js';

// ============================================================
// PRODUCT SERVICE — lógica de negocio del catálogo
// (Tienda de Telecomunicaciones)
// ============================================================

export async function getAll(userId?: string): Promise<IProduct[]> {
  return productRepo.findAllProducts(userId);
}

export async function getById(id: string): Promise<IProduct> {
  const product = await productRepo.findProductById(id);
  if (!product) throw new AppError(404, 'Product not found');
  return product;
}

export async function create(dto: CreateProductDto, createdBy: string): Promise<IProduct> {
  return productRepo.createProduct(dto, createdBy);
}

export async function update(
  id: string,
  dto: UpdateProductDto,
  requesterId: string,
  requesterRole: string,
): Promise<IProduct> {
  const existing = await productRepo.findProductById(id);
  if (!existing) throw new AppError(404, 'Product not found');

  // Solo el creador del producto o un admin puede actualizarlo
  if (existing.createdBy !== requesterId && requesterRole !== 'admin') {
    throw new AppError(403, 'Insufficient permissions');
  }

  const updated = await productRepo.updateProduct(id, dto);
  if (!updated) throw new AppError(404, 'Product not found');
  return updated;
}

export async function remove(
  id: string,
  requesterId: string,
  requesterRole: string,
): Promise<void> {
  const existing = await productRepo.findProductById(id);
  if (!existing) throw new AppError(404, 'Product not found');

  // Solo el creador del producto o un admin puede eliminarlo
  if (existing.createdBy !== requesterId && requesterRole !== 'admin') {
    throw new AppError(403, 'Insufficient permissions');
  }

  await productRepo.deleteProduct(id);
}
