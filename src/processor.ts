import type { Product, ProductSummary } from './types.js';

export function filterByCategory(items: Product[], categoryFilter: string | null): Product[] {
  if (categoryFilter === null) return items;

  const filtered = items.filter(
    (item) => item.category.toLowerCase() === categoryFilter.toLowerCase()
  );

  if (filtered.length === 0) {
    const available = Array.from(new Set(items.map((i) => i.category)));
    throw new Error(
      `No hay productos en la categoría "${categoryFilter}". Categorías disponibles: ${available.join(', ')}`
    );
  }

  return filtered;
}

export function calculateSummary(items: Product[]): ProductSummary {
  const total = items.length;
  const active = items.filter((i) => i.active).length;
  const inactive = total - active;

  const totalPrice = items.reduce((sum, i) => sum + i.price, 0);
  const averagePrice = Number((totalPrice / total).toFixed(2));

  const sortedByPrice = [...items].sort((a, b) => a.price - b.price);
  const cheapest = sortedByPrice[0];
  const mostExpensive = sortedByPrice[sortedByPrice.length - 1];

  const categories = Array.from(new Set(items.map((i) => i.category)));

  return { total, active, inactive, averagePrice, mostExpensive, cheapest, categories };
}
