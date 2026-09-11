import { ICategory } from '../models/category.model';
import * as repo from '../repositories/category.repository';
import { CreateCategoryDto, UpdateCategoryDto } from '../schemas/category.schema';

export async function findAll(): Promise<ICategory[]> {
  return repo.findAll();
}

export async function findById(id: string): Promise<ICategory> {
  return repo.findById(id);
}

export async function create(dto: CreateCategoryDto): Promise<ICategory> {
  return repo.create(dto);
}

export async function update(id: string, dto: UpdateCategoryDto): Promise<ICategory> {
  return repo.update(id, dto);
}

export async function remove(id: string): Promise<void> {
  return repo.remove(id);
}
