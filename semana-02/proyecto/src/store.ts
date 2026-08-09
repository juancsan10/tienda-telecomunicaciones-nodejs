import type { Product, CreateProductDto, UpdateProductDto } from './types.js';

const products: Product[] = [];
let nextId = 1;

export function getAll(): Product[] {
  return products;
}

export function getById(id: number): Product | undefined {
  return products.find((p) => p.id === id);
}

export function create(data: CreateProductDto): Product {
  const newProduct: Product = { id: nextId++, ...data };
  products.push(newProduct);
  return newProduct;
}

export function update(id: number, data: UpdateProductDto): Product | undefined {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return undefined;

  products[index] = { ...products[index], ...data };
  return products[index];
}

export function remove(id: number): boolean {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return false;

  products.splice(index, 1);
  return true;
}
