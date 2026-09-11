import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createProductSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  sku: z.string().min(1).trim(),
  price: z.number().positive('price debe ser mayor a 0'),
  stock: z.number().int().nonnegative().default(0),
  active: z.boolean().default(true),
  category: z.string().regex(objectIdRegex, 'category debe ser un ObjectId válido'),
});

export const updateProductSchema = createProductSchema.partial();

export const idParamSchema = z.object({
  id: z.string().regex(objectIdRegex, 'id debe ser un ObjectId válido'),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
