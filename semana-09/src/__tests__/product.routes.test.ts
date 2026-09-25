// ============================================================
// INTEGRATION TESTS — product routes
// ============================================================
// Ciclo completo con Supertest + MongoDB Memory Server.
// Dominio: Tienda de Telecomunicaciones.
// ============================================================

import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../app';

let mongod: MongoMemoryServer;
let userToken: string;
let adminToken: string;

const validProduct = {
  name: 'Plan Ilimitado 20GB',
  sku: 'PLN-20GB',
  category: 'planes',
  price: 45000,
  stock: 50,
};

beforeAll(async () => {
  mongod = await MongoMemoryServer.create({
    binary: {
      version: '7.0.14',
    },
  });
  await mongoose.connect(mongod.getUri(), {
    serverSelectionTimeoutMS: 30000,
  });

  // Usuario normal
  await request(app)
    .post('/api/v1/auth/register')
    .send({ name: 'Usuario', email: 'user@test.com', password: 'Password1!' });
  const userLogin = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'user@test.com', password: 'Password1!' });
  userToken = userLogin.body.accessToken as string;

  // Usuario admin — se registra igual, luego se promueve directo en la BD
  await request(app)
    .post('/api/v1/auth/register')
    .send({ name: 'Admin', email: 'admin@test.com', password: 'Password1!' });
  await mongoose.connection.collection('users').updateOne(
    { email: 'admin@test.com' },
    { $set: { role: 'admin' } },
  );
  const adminLogin = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'admin@test.com', password: 'Password1!' });
  adminToken = adminLogin.body.accessToken as string;
}, 180000);

afterEach(async () => {
  // Limpiar solo la colección de productos entre tests, mantener usuarios de auth
  await mongoose.connection.collection('products').deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe('Products Routes — Integration Tests', () => {
  describe('GET /api/v1/products', () => {
    it('should return 200 and empty array initially', async () => {
      const res = await request(app).get('/api/v1/products');

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
      expect(res.body.total).toBe(0);
    });
  });

  describe('POST /api/v1/products', () => {
    it('should return 201 with valid data and token', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send(validProduct);

      expect(res.status).toBe(201);
      expect(res.body.data.sku).toBe('PLN-20GB');
      expect(res.body.data.category).toBe('planes');
    });

    it('should return 401 without token', async () => {
      const res = await request(app).post('/api/v1/products').send(validProduct);

      expect(res.status).toBe(401);
    });

    it('should return 422 with invalid data', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'X', category: 'categoria-invalida' });

      expect(res.status).toBe(422);
    });
  });

  describe('GET /api/v1/products/:id', () => {
    it('should return 200 with existing product', async () => {
      const created = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send(validProduct);

      const res = await request(app).get(`/api/v1/products/${created.body.data._id}`);

      expect(res.status).toBe(200);
      expect(res.body.data.sku).toBe('PLN-20GB');
    });

    it('should return 404 with non-existent ID', async () => {
      const res = await request(app).get('/api/v1/products/507f1f77bcf86cd799439011');

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/v1/products/:id', () => {
    it('should return 200 when owner updates', async () => {
      const created = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send(validProduct);

      const res = await request(app)
        .put(`/api/v1/products/${created.body.data._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ price: 50000 });

      expect(res.status).toBe(200);
      expect(res.body.data.price).toBe(50000);
    });

    it('should return 403 when non-owner tries to update', async () => {
      const created = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ ...validProduct, sku: 'PLN-30GB' });

      // admin también puede, así que probamos con un tercer usuario normal
      await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'Otro', email: 'otro@test.com', password: 'Password1!' });
      const otherLogin = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'otro@test.com', password: 'Password1!' });

      const res = await request(app)
        .put(`/api/v1/products/${created.body.data._id}`)
        .set('Authorization', `Bearer ${otherLogin.body.accessToken}`)
        .send({ price: 1 });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/v1/products/:id', () => {
    it('should return 204 when admin deletes', async () => {
      const created = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ ...validProduct, sku: 'PLN-40GB' });

      const res = await request(app)
        .delete(`/api/v1/products/${created.body.data._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(204);
    });

    it('should return 403 when non-owner, non-admin tries to delete', async () => {
      const created = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ ...validProduct, sku: 'PLN-50GB' });

      await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'Otro2', email: 'otro2@test.com', password: 'Password1!' });
      const otherLogin = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'otro2@test.com', password: 'Password1!' });

      const res = await request(app)
        .delete(`/api/v1/products/${created.body.data._id}`)
        .set('Authorization', `Bearer ${otherLogin.body.accessToken}`);

      expect(res.status).toBe(403);
    });
  });
});
