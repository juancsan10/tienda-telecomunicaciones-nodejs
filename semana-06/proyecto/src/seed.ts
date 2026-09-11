import 'dotenv/config';
import { connectDB, disconnectDB } from './lib/mongoose';
import { Category } from './models/category.model';
import { Product } from './models/product.model';

async function seed(): Promise<void> {
  await connectDB();

  // Siempre limpiar en orden: principal primero, secundaria después
  await Product.deleteMany({});
  await Category.deleteMany({});

  const categories = await Category.insertMany([
    { name: 'planes', description: 'Planes de datos y minutos' },
    { name: 'dispositivos', description: 'Celulares, tablets y routers' },
    { name: 'accesorios', description: 'Fundas, cargadores, audífonos' },
    { name: 'lineas', description: 'SIM cards y portabilidad' },
  ]);

  const [planes, dispositivos, accesorios, lineas] = categories;

  await Product.insertMany([
    { name: 'Plan Ilimitado 20GB', sku: 'PLAN-20GB', price: 45.9, stock: 500, active: true, category: planes!._id },
    { name: 'Plan Básico 5GB', sku: 'PLAN-5GB', price: 19.9, stock: 300, active: true, category: planes!._id },
    { name: 'iPhone 15', sku: 'DEV-IP15', price: 999, stock: 8, active: true, category: dispositivos!._id },
    { name: 'Samsung Galaxy A54', sku: 'DEV-SGA54', price: 349, stock: 15, active: true, category: dispositivos!._id },
    { name: 'Funda Protectora Universal', sku: 'ACC-FUNDA', price: 9.99, stock: 80, active: true, category: accesorios!._id },
    { name: 'SIM Card Prepago', sku: 'LIN-SIM01', price: 5, stock: 1000, active: true, category: lineas!._id },
  ]);

  console.log(`Seed completado: ${categories.length} categorías, 6 productos`);
  await disconnectDB();
}

seed().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
