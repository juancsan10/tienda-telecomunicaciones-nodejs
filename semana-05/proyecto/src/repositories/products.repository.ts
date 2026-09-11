import { Product } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { CreateProductDto, UpdateProductDto } from '../schemas/products.schema';

export async function findAll(skip: number, take: number): Promise<{ data: Product[]; total: number }> {
  const [data, total] = await Promise.all([
    prisma.product.findMany({
      skip,
      take,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count(),
  ]);
  return { data, total };
}

// Lanza P2025 si no existe -> lo captura el errorHandler global
export async function findById(id: string): Promise<Product> {
  return prisma.product.findUniqueOrThrow({
    where: { id },
    include: { category: true },
  });
}

// Lanza P2002 si el sku ya existe -> lo captura el errorHandler global
export async function create(dto: CreateProductDto): Promise<Product> {
  return prisma.product.create({ data: dto, include: { category: true } });
}

// Lanza P2025 si no existe -> lo captura el errorHandler global
export async function update(id: string, dto: UpdateProductDto): Promise<Product> {
  return prisma.product.update({
    where: { id },
    data: dto,
    include: { category: true },
  });
}

// Lanza P2025 si no existe -> lo captura el errorHandler global
export async function remove(id: string): Promise<void> {
  await prisma.product.delete({ where: { id } });
}
