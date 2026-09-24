import { Product, IProduct } from '../models/product.model.js';
import { CreateProductDto, UpdateProductDto } from '../schemas/product.schema.js';
import { AppError } from '../errors/AppError.js';

interface PaginatedResult {
  data: IProduct[];
  total: number;
}

export async function findAll(page: number, limit: number): Promise<PaginatedResult> {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    Product.find().skip(skip).limit(limit),
    Product.countDocuments(),
  ]);
  return { data, total };
}

export async function findById(id: string): Promise<IProduct> {
  let product;
  try {
    product = await Product.findById(id);
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      throw new AppError(400, 'ID inválido');
    }
    throw err;
  }

  if (!product) throw new AppError(404, 'Product not found');
  return product;
}

export async function create(dto: CreateProductDto, createdBy: string): Promise<IProduct> {
  try {
    return await Product.create({ ...dto, createdBy });
  } catch (err) {
    if (isDuplicateKeyError(err)) {
      throw new AppError(409, 'Ya existe un producto con ese SKU');
    }
    throw err;
  }
}

export async function update(id: string, dto: UpdateProductDto): Promise<IProduct> {
  let updated;
  try {
    updated = await Product.findByIdAndUpdate(id, dto, { new: true });
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      throw new AppError(400, 'ID inválido');
    }
    if (isDuplicateKeyError(err)) {
      throw new AppError(409, 'Ya existe un producto con ese SKU');
    }
    throw err;
  }

  if (!updated) throw new AppError(404, 'Product not found');
  return updated;
}

export async function remove(id: string): Promise<void> {
  let deleted;
  try {
    deleted = await Product.findByIdAndDelete(id);
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      throw new AppError(400, 'ID inválido');
    }
    throw err;
  }

  if (!deleted) throw new AppError(404, 'Product not found');
}

function isDuplicateKeyError(err: unknown): boolean {
  return typeof err === 'object' && err !== null && 'code' in err && (err as { code: number }).code === 11000;
}
