import { Product, PaginatedResponse } from '../types';
import { CreateProductDto, UpdateProductDto } from '../schemas/product.schema';
import { AppError } from '../errors/AppError';
import * as repo from '../repositories/products.repository';

export async function findAll(page: number, limit: number): Promise<PaginatedResponse<Product>> {
  const all = await repo.findAll();
  const start = (page - 1) * limit;
  const data = all.slice(start, start + limit);
  return { data, total: all.length, page, limit };
}

export async function findById(id: number): Promise<Product> {
  const product = await repo.findById(id);
  if (!product) {
    throw new AppError(404, `Product with id ${id} not found`);
  }
  return product;
}

export async function create(dto: CreateProductDto): Promise<Product> {
  return repo.create(dto);
}

export async function update(id: number, dto: UpdateProductDto): Promise<Product> {
  const exists = await repo.findById(id);
  if (!exists) {
    throw new AppError(404, `Product with id ${id} not found`);
  }
  return (await repo.update(id, dto))!;
}

export async function remove(id: number): Promise<void> {
  const removed = await repo.remove(id);
  if (!removed) {
    throw new AppError(404, `Product with id ${id} not found`);
  }
}
