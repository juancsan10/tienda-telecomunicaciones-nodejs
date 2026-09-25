import { ProductModel, type IProduct } from '../models/product.model.js';
import type { CreateProductDto, UpdateProductDto } from '../types/index.js';
import { AppError } from '../errors/AppError.js';

// ============================================================
// REPOSITORIO DE PRODUCTS — capa de acceso a datos
// ============================================================
// En los unit tests, ESTE módulo se mockea con jest.mock().
// En los integration tests, accede a MongoDB Memory Server.
// ============================================================

export async function findAllProducts(createdBy?: string): Promise<IProduct[]> {
  const filter = createdBy ? { createdBy } : {};
  return ProductModel.find(filter).lean<IProduct[]>().exec();
}

export async function findProductById(id: string): Promise<IProduct | null> {
  return ProductModel.findById(id).lean<IProduct>().exec();
}

export async function createProduct(
  dto: CreateProductDto,
  createdBy: string,
): Promise<IProduct> {
  try {
    const product = new ProductModel({ ...dto, createdBy });
    return (await product.save()) as unknown as IProduct;
  } catch (err) {
    if (isDuplicateKeyError(err)) {
      throw new AppError(409, 'Ya existe un producto con ese SKU');
    }
    throw err;
  }
}

export async function updateProduct(
  id: string,
  dto: UpdateProductDto,
): Promise<IProduct | null> {
  try {
    return await ProductModel.findByIdAndUpdate(id, dto, { new: true }).lean<IProduct>().exec();
  } catch (err) {
    if (isDuplicateKeyError(err)) {
      throw new AppError(409, 'Ya existe un producto con ese SKU');
    }
    throw err;
  }
}

export async function deleteProduct(id: string): Promise<IProduct | null> {
  return ProductModel.findByIdAndDelete(id).lean<IProduct>().exec();
}

function isDuplicateKeyError(err: unknown): boolean {
  return typeof err === 'object' && err !== null && 'code' in err && (err as { code: number }).code === 11000;
}
