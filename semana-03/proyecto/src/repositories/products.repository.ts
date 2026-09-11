// ============================================
// REPOSITORY — Único punto de acceso al store
// ============================================
import { Product, CreateProductDto, UpdateProductDto } from '../types';

const store: Product[] = [
  { id: 1, name: 'Plan Ilimitado 20GB', category: 'planes', price: 45.9, stock: 500, active: true, createdAt: new Date().toISOString() },
  { id: 2, name: 'Plan Básico 5GB', category: 'planes', price: 19.9, stock: 300, active: true, createdAt: new Date().toISOString() },
  { id: 3, name: 'iPhone 15', category: 'dispositivos', price: 999, stock: 8, active: true, createdAt: new Date().toISOString() },
  { id: 4, name: 'Samsung Galaxy A54', category: 'dispositivos', price: 349, stock: 15, active: true, createdAt: new Date().toISOString() },
  { id: 5, name: 'Funda Protectora Universal', category: 'accesorios', price: 9.99, stock: 80, active: true, createdAt: new Date().toISOString() },
];
let nextId = 6;

export async function findAll(): Promise<Product[]> {
  return [...store];
}

export async function findById(id: number): Promise<Product | undefined> {
  return store.find((p) => p.id === id);
}

export async function create(dto: CreateProductDto): Promise<Product> {
  const product: Product = { id: nextId++, ...dto, createdAt: new Date().toISOString() };
  store.push(product);
  return { ...product };
}

export async function update(id: number, dto: UpdateProductDto): Promise<Product | undefined> {
  const index = store.findIndex((p) => p.id === id);
  if (index === -1) return undefined;
  store[index] = { ...store[index]!, ...dto };
  return { ...store[index]! };
}

export async function remove(id: number): Promise<boolean> {
  const index = store.findIndex((p) => p.id === id);
  if (index === -1) return false;
  store.splice(index, 1);
  return true;
}
