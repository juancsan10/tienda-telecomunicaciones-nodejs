import { z } from 'zod';

const CATEGORIES = ['planes', 'dispositivos', 'accesorios', 'lineas'] as const;

export const createProductSchema = z.object({
  name: z.string().min(1, 'name es requerido').trim(),
  category: z.enum(CATEGORIES, {
    error: `category debe ser una de: ${CATEGORIES.join(', ')}`,
  }),
  price: z.number().positive('price debe ser mayor a 0'),
  stock: z.number().int().nonnegative('stock no puede ser negativo').default(0),
  active: z.boolean().default(true),
});

export const updateProductSchema = createProductSchema.partial();

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive('id debe ser un entero positivo'),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
