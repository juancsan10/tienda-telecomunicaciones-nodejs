import { z } from 'zod';

const CATEGORIES = ['planes', 'dispositivos', 'accesorios', 'lineas'] as const;

export const createProductSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  sku: z.string().min(1).trim(),
  category: z.enum(CATEGORIES, {
    error: `category debe ser una de: ${CATEGORIES.join(', ')}`,
  }),
  price: z.number().positive('price debe ser mayor a 0'),
  stock: z.number().int().nonnegative().default(0),
  active: z.boolean().default(true),
});

export const updateProductSchema = createProductSchema.partial();

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
export const idParamSchema = z.object({
  id: z.string().regex(objectIdRegex, 'id debe ser un ObjectId válido'),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
