import { z } from 'zod';

const CATEGORIES = ['planes', 'dispositivos', 'accesorios', 'lineas'] as const;

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).trim(),
    sku: z.string().min(1).trim(),
    category: z.enum(CATEGORIES, {
      error: `category debe ser una de: ${CATEGORIES.join(', ')}`,
    }),
    price: z.number().positive('price debe ser mayor a 0'),
    stock: z.number().int().nonnegative().default(0),
    active: z.boolean().default(true),
  }),
});

export const updateProductSchema = z.object({
  body: createProductSchema.shape.body.partial(),
});

export type CreateProductDto = z.infer<typeof createProductSchema>['body'];
export type UpdateProductDto = z.infer<typeof updateProductSchema>['body'];
