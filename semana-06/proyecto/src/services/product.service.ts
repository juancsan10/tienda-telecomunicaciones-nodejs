import { IProduct } from '../models/product.model';
import * as repo from '../repositories/product.repository';
import { CreateProductDto, UpdateProductDto } from '../schemas/product.schema';

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

export async function create(dto: CreateProductDto): Promise<IProduct> {
  return repo.create(dto);
}

export async function update(id: string, dto: UpdateProductDto): Promise<IProduct> {
  return repo.update(id, dto);
}

export async function remove(id: string): Promise<void> {
  return repo.remove(id);
}
