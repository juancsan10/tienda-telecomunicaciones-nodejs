import { IProduct } from '../models/product.model.js';
import * as repo from '../repositories/product.repository.js';
import { CreateProductDto, UpdateProductDto } from '../schemas/product.schema.js';
import { AppError } from '../errors/AppError.js';

interface PaginatedProducts {
  data: IProduct[];
  total: number;
  page: number;
  totalPages: number;
}

export async function findAll(page: number, limit: number): Promise<PaginatedProducts> {
  const { data, total } = await repo.findAll(page, limit);
  return { data, total, page, totalPages: Math.ceil(total / limit) };
}

export async function findById(id: string): Promise<IProduct> {
  return repo.findById(id);
}

export async function create(dto: CreateProductDto, createdBy: string): Promise<IProduct> {
  return repo.create(dto, createdBy);
}

// Solo el dueño del producto o un admin pueden actualizarlo
export async function update(
  id: string,
  dto: UpdateProductDto,
  userId: string,
  userRole: string
): Promise<IProduct> {
  const product = await repo.findById(id);

  if (product.createdBy !== userId && userRole !== 'admin') {
    throw new AppError(403, 'Solo el dueño del producto o un admin pueden editarlo');
  }

  return repo.update(id, dto);
}

export async function remove(id: string): Promise<void> {
  return repo.remove(id);
}
