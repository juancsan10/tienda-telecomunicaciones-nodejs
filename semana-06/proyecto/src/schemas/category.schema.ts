import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2).max(50).trim(),
  description: z.string().max(200).trim().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
export const idParamSchema = z.object({
  id: z.string().regex(objectIdRegex, 'id debe ser un ObjectId válido'),
});

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
