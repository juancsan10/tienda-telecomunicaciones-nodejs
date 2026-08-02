import { readFile } from 'fs/promises';
import { join } from 'path';
import type { Product } from './types.js';

export async function readItems(): Promise<Product[]> {
  const filePath = join(import.meta.dirname, '..', 'data', 'productos.json');
  try {
    const raw = await readFile(filePath, 'utf-8');
    return JSON.parse(raw) as Product[];
  } catch (err) {
    throw new Error(`No se pudo leer productos.json: ${err instanceof Error ? err.message : err}`);
  }
}
