import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const categories = [
    { name: 'planes' },
    { name: 'dispositivos' },
    { name: 'accesorios' },
    { name: 'lineas' },
  ];

  const categoryMap = new Map<string, string>();

  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
    categoryMap.set(cat.name, created.id);
  }

  const products = [
    { name: 'Plan Ilimitado 20GB', sku: 'PLAN-20GB', price: 45.9, stock: 500, active: true, category: 'planes' },
    { name: 'Plan Básico 5GB', sku: 'PLAN-5GB', price: 19.9, stock: 300, active: true, category: 'planes' },
    { name: 'iPhone 15', sku: 'DEV-IP15', price: 999, stock: 8, active: true, category: 'dispositivos' },
    { name: 'Samsung Galaxy A54', sku: 'DEV-SGA54', price: 349, stock: 15, active: true, category: 'dispositivos' },
    { name: 'Funda Protectora Universal', sku: 'ACC-FUNDA', price: 9.99, stock: 80, active: true, category: 'accesorios' },
    { name: 'SIM Card Prepago', sku: 'LIN-SIM01', price: 5, stock: 1000, active: true, category: 'lineas' },
  ];

  for (const p of products) {
    const { category, ...data } = p;
    await prisma.product.upsert({
      where: { sku: data.sku },
      update: {},
      create: { ...data, categoryId: categoryMap.get(category) },
    });
  }

  console.log(`Seed completado: ${categories.length} categorías, ${products.length} productos`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
