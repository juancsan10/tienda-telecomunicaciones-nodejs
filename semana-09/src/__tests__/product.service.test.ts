// ============================================================
// UNIT TESTS — product.service.ts
// ============================================================
// Mockeamos product.repository completo para testear la lógica
// de negocio en aislamiento (sin tocar MongoDB).
// Dominio: Tienda de Telecomunicaciones.
// ============================================================

jest.mock('../repositories/product.repository');

import * as productRepo from '../repositories/product.repository';
import * as productService from '../services/product.service';
import { AppError } from '../errors/AppError';
import type { IProduct } from '../models/product.model';

const mockFindAll  = productRepo.findAllProducts as jest.MockedFunction<typeof productRepo.findAllProducts>;
const mockFindById = productRepo.findProductById as jest.MockedFunction<typeof productRepo.findProductById>;
const mockCreate   = productRepo.createProduct as jest.MockedFunction<typeof productRepo.createProduct>;
const mockUpdate   = productRepo.updateProduct as jest.MockedFunction<typeof productRepo.updateProduct>;
const mockDelete   = productRepo.deleteProduct as jest.MockedFunction<typeof productRepo.deleteProduct>;

const productBase = {
  _id: 'product-id-123',
  name: 'Plan Ilimitado 20GB',
  sku: 'PLN-20GB',
  category: 'planes',
  price: 45000,
  stock: 100,
  active: true,
  createdBy: 'user-id-abc',
  createdAt: new Date(),
  updatedAt: new Date(),
} as unknown as IProduct;

describe('ProductService — Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll()', () => {
    it('should return all products', async () => {
      mockFindAll.mockResolvedValue([productBase]);

      const result = await productService.getAll();

      expect(mockFindAll).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(1);
      expect(result[0]?.sku).toBe('PLN-20GB');
    });

    it('should return empty array when no products exist', async () => {
      mockFindAll.mockResolvedValue([]);

      const result = await productService.getAll();

      expect(result).toEqual([]);
    });
  });

  describe('getById()', () => {
    it('should return the product when found', async () => {
      mockFindById.mockResolvedValue(productBase);

      const result = await productService.getById('product-id-123');

      expect(mockFindById).toHaveBeenCalledWith('product-id-123');
      expect(result.name).toBe('Plan Ilimitado 20GB');
    });

    it('should throw AppError 404 when product does not exist', async () => {
      mockFindById.mockResolvedValue(null);

      await expect(productService.getById('nope')).rejects.toThrow(AppError);
      await expect(productService.getById('nope')).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('create()', () => {
    const dto = {
      name: 'Plan Ilimitado 20GB',
      sku: 'PLN-20GB',
      category: 'planes' as const,
      price: 45000,
      stock: 100,
      active: true,
    };

    it('should create and return the new product', async () => {
      mockCreate.mockResolvedValue(productBase);

      const result = await productService.create(dto, 'user-id-abc');

      expect(mockCreate).toHaveBeenCalledWith(dto, 'user-id-abc');
      expect(result.sku).toBe('PLN-20GB');
    });

    it('should propagate AppError 409 when SKU is duplicated', async () => {
      mockCreate.mockRejectedValue(new AppError(409, 'Ya existe un producto con ese SKU'));

      await expect(productService.create(dto, 'user-id-abc')).rejects.toMatchObject({
        statusCode: 409,
      });
    });
  });

  describe('update()', () => {
    it('should update and return the product when requester is the owner', async () => {
      mockFindById.mockResolvedValue(productBase);
      mockUpdate.mockResolvedValue({ ...productBase, price: 50000 } as IProduct);

      const result = await productService.update(
        'product-id-123',
        { price: 50000 },
        'user-id-abc',
        'user',
      );

      expect(mockUpdate).toHaveBeenCalledWith('product-id-123', { price: 50000 });
      expect(result.price).toBe(50000);
    });

    it('should update the product when requester is admin (not the owner)', async () => {
      mockFindById.mockResolvedValue(productBase);
      mockUpdate.mockResolvedValue({ ...productBase, active: false } as IProduct);

      const result = await productService.update(
        'product-id-123',
        { active: false },
        'another-admin-id',
        'admin',
      );

      expect(result.active).toBe(false);
    });

    it('should throw AppError 403 when requester is not the owner nor admin', async () => {
      mockFindById.mockResolvedValue(productBase);

      await expect(
        productService.update('product-id-123', { price: 1 }, 'other-user-id', 'user'),
      ).rejects.toMatchObject({ statusCode: 403 });
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it('should throw AppError 404 when product does not exist', async () => {
      mockFindById.mockResolvedValue(null);

      await expect(
        productService.update('nope', { price: 1 }, 'user-id-abc', 'user'),
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('remove()', () => {
    it('should delete the product when requester is the owner', async () => {
      mockFindById.mockResolvedValue(productBase);
      mockDelete.mockResolvedValue(productBase);

      await productService.remove('product-id-123', 'user-id-abc', 'user');

      expect(mockDelete).toHaveBeenCalledWith('product-id-123');
    });

    it('should delete the product when requester is admin', async () => {
      mockFindById.mockResolvedValue(productBase);
      mockDelete.mockResolvedValue(productBase);

      await productService.remove('product-id-123', 'another-admin-id', 'admin');

      expect(mockDelete).toHaveBeenCalledWith('product-id-123');
    });

    it('should throw AppError 403 when requester is not owner or admin', async () => {
      mockFindById.mockResolvedValue(productBase);

      await expect(
        productService.remove('product-id-123', 'other-user-id', 'user'),
      ).rejects.toMatchObject({ statusCode: 403 });
      expect(mockDelete).not.toHaveBeenCalled();
    });

    it('should throw AppError 404 when product does not exist', async () => {
      mockFindById.mockResolvedValue(null);

      await expect(
        productService.remove('nope', 'user-id-abc', 'user'),
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});
