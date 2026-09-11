import { Category, ICategory } from '../models/category.model';
import { CreateCategoryDto, UpdateCategoryDto } from '../schemas/category.schema';
import { AppError } from '../errors/AppError';

export async function findAll(): Promise<ICategory[]> {
  return Category.find().lean();
}

export async function findById(id: string): Promise<ICategory> {
  let category;
  try {
    category = await Category.findById(id).lean();
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      throw new AppError(400, 'ID inválido');
    }
    throw err;
  }

  if (!category) {
    throw new AppError(404, 'Category not found');
  }
  return category;
}

export async function create(dto: CreateCategoryDto): Promise<ICategory> {
  try {
    return await Category.create(dto);
  } catch (err) {
    if (isDuplicateKeyError(err)) {
      throw new AppError(409, 'Ya existe una categoría con ese nombre');
    }
    throw err;
  }
}

export async function update(id: string, dto: UpdateCategoryDto): Promise<ICategory> {
  let updated;
  try {
    updated = await Category.findByIdAndUpdate(id, dto, { new: true }).lean();
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      throw new AppError(400, 'ID inválido');
    }
    if (isDuplicateKeyError(err)) {
      throw new AppError(409, 'Ya existe una categoría con ese nombre');
    }
    throw err;
  }

  if (!updated) {
    throw new AppError(404, 'Category not found');
  }
  return updated;
}

export async function remove(id: string): Promise<void> {
  let deleted;
  try {
    deleted = await Category.findByIdAndDelete(id).lean();
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      throw new AppError(400, 'ID inválido');
    }
    throw err;
  }

  if (!deleted) {
    throw new AppError(404, 'Category not found');
  }
}

function isDuplicateKeyError(err: unknown): boolean {
  return typeof err === 'object' && err !== null && 'code' in err && (err as { code: number }).code === 11000;
}
