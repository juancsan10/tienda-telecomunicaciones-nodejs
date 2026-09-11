import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'name es requerido').trim(),
  sku: z.string().min(1, 'sku es requerido').trim(),
  price: z.number().positive('price debe ser mayor a 0'),
  stock: z.number().int().nonnegative('stock no puede ser negativo').default(0),
  active: z.boolean().default(true),
  categoryId: z.string().uuid('categoryId debe ser un UUID válido').optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const idParamSchema = z.object({
  id: z.string().uuid('id debe ser un UUID válido'),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
