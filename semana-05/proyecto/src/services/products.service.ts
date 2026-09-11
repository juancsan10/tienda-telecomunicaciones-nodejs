import { Product } from '@prisma/client';
import * as repo from '../repositories/products.repository';
import { CreateProductDto, UpdateProductDto } from '../schemas/products.schema';

interface PaginatedProducts {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

export async function findAll(page: number, limit: number): Promise<PaginatedProducts> {
  const skip = (page - 1) * limit;
  const { data, total } = await repo.findAll(skip, limit);
  return { data, total, page, limit };
}

export async function findById(id: string): Promise<Product> {
  return repo.findById(id);
}

export async function create(dto: CreateProductDto): Promise<Product> {
  return repo.create(dto);
}

export async function update(id: string, dto: UpdateProductDto): Promise<Product> {
  return repo.update(id, dto);
}

export async function remove(id: string): Promise<void> {
  return repo.remove(id);
}
