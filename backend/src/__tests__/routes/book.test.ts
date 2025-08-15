import request from 'supertest';
import app from '../../index';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Book Routes', () => {
  beforeAll(async () => {
    // Setup test database
  });

  afterAll(async () => {
    // Cleanup test database
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean up before each test
  });

  describe('GET /api/v1/book', () => {
    it('should return a list of book', async () => {
      const response = await request(app).get('/api/v1/book').expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should handle pagination parameters', async () => {
      const response = await request(app)
        .get('/api/v1/book?limit=5&offset=0')
        .expect(200);

      expect(response.body.pagination.limit).toBe(5);
      expect(response.body.pagination.offset).toBe(0);
    });
  });

  describe('GET /api/v1/book/:id', () => {
    it('should return a book by ID', async () => {
      // Create a test book first
      const createdBook = await prisma.book.create({
        data: {
          name: 'Test Book',
        },
      });

      const response = await request(app)
        .get('/api/v1/book/' + createdBook.id)
        .expect(200);

      expect(response.body.id).toBe(createdBook.id);
      expect(response.body.name).toBe('Test Book');
    });

    it('should return 404 for non-existent book', async () => {
      await request(app).get('/api/v1/book/99999').expect(404);
    });

    it('should return 400 for invalid ID', async () => {
      await request(app).get('/api/v1/book/invalid').expect(400);
    });
  });

  describe('POST /api/v1/book', () => {
    it('should create a new book', async () => {
      const bookData = {
        name: 'New Book',
      };

      const response = await request(app)
        .post('/api/v1/book')
        .send(bookData)
        .expect(201);

      expect(response.body.name).toBe(bookData.name);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
    });

    it('should return validation error for invalid data', async () => {
      const invalidData = {
        name: '', // Empty name should fail validation
      };

      await request(app).post('/api/v1/book').send(invalidData).expect(400);
    });
  });

  describe('PUT /api/v1/book/:id', () => {
    it('should update an existing book', async () => {
      // Create a test book first
      const createdBook = await prisma.book.create({
        data: {
          name: 'Original Book',
        },
      });

      const updateData = {
        name: 'Updated Book',
      };

      const response = await request(app)
        .put('/api/v1/book/' + createdBook.id)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe(updateData.name);
      expect(response.body.id).toBe(createdBook.id);
    });

    it('should return 404 for non-existent book', async () => {
      const updateData = { name: 'Updated Book' };

      await request(app).put('/api/v1/book/99999').send(updateData).expect(404);
    });

    it('should return 400 for invalid ID', async () => {
      const updateData = { name: 'Updated Book' };

      await request(app)
        .put('/api/v1/book/invalid')
        .send(updateData)
        .expect(400);
    });
  });

  describe('DELETE /api/v1/book/:id', () => {
    it('should delete an existing book', async () => {
      // Create a test book first
      const createdBook = await prisma.book.create({
        data: {
          name: 'To Delete Book',
        },
      });

      await request(app)
        .delete('/api/v1/book/' + createdBook.id)
        .expect(204);

      // Verify the book was deleted
      const deletedBook = await prisma.book.findUnique({
        where: { id: createdBook.id },
      });

      expect(deletedBook).toBeNull();
    });

    it('should return 404 for non-existent book', async () => {
      await request(app).delete('/api/v1/book/99999').expect(404);
    });

    it('should return 400 for invalid ID', async () => {
      await request(app).delete('/api/v1/book/invalid').expect(400);
    });
  });
});
