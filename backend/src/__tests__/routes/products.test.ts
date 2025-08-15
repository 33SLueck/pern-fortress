import request from 'supertest';
import app from '../../index';

describe('Products Routes', () => {
  describe('GET /api/v1/products', () => {
    it('should return all products', async () => {
      const response = await request(app).get('/api/v1/products').expect(200);

      expect(response.body).toHaveProperty('products');
      expect(Array.isArray(response.body.products)).toBe(true);
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('limit');
      expect(response.body).toHaveProperty('offset');
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/v1/products?limit=5&offset=10')
        .expect(200);

      expect(response.body.limit).toBe(5);
      expect(response.body.offset).toBe(10);
    });
  });

  describe('GET /api/v1/products/:id', () => {
    it('should return products by ID', async () => {
      const response = await request(app).get('/api/v1/products/1').expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app)
        .get('/api/v1/products/invalid')
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.status).toBe(400);
    });
  });

  describe('POST /api/v1/products', () => {
    it('should create new products', async () => {
      const newProducts = {
        name: 'Test Products',
      };

      const response = await request(app)
        .post('/api/v1/products')
        .send(newProducts)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newProducts.name);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
    });

    it('should return 400 for missing name', async () => {
      const response = await request(app)
        .post('/api/v1/products')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.status).toBe(400);
    });
  });
});
