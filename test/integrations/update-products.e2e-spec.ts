import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../../src/app.module';
import { PrismaService } from '@adapters/drivens/infra/database/prisma/prisma.service';
import { randomUUID } from 'crypto';

describe('PUT /products/:id - Product update feature', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let response: request.Response;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await prisma.product.deleteMany(); // Clean up test data
    await app.close();
  });

  describe('Scenario: Updating a product with valid details', () => {
    it('should update the product successfully', async () => {
      // Given I already have created a product in DB
      const product = await prisma.product.create({
        data: {
          name: 'Old Product Name',
          description: 'Old description for product',
          image: 'http://example.com/old-image.png',
          price: 20,
          id: randomUUID(),
        },
      });
      // When I send a PUT request to "/products/:id" with new product details
      response = await request(app.getHttpServer())
        .put(`/products/${product.id}`)
        .send({
          name: 'Updated Product Name',
          description: 'Updated description for product',
          image: 'http://example.com/updated-image.png',
          price: 30,
        });

      // Then the response status code should be 200
      expect(response.statusCode).toBe(200);

      // And the product details should be updated in the database
      const updatedProduct = await prisma.product.findUnique({
        where: { id: product.id },
      });

      expect(updatedProduct?.name).toBe('Updated Product Name');
      expect(updatedProduct?.description).toBe(
        'Updated description for product',
      );
      expect(updatedProduct?.image).toBe(
        'http://example.com/updated-image.png',
      );
      expect(Number(updatedProduct?.price)).toBe(30);
    });
  });

  describe('Scenario: Updating a product with invalid details', () => {
    it('should return a 400 status code when updating with an invalid price', async () => {
      // Given I already have created a product in DB
      const product = await prisma.product.create({
        data: {
          name: 'Old Product Name',
          description: 'Old description for product',
          image: 'http://example.com/old-image.png',
          price: 20,
          id: randomUUID(),
        },
      });
      // When I send a PUT request to "/products/:id" with an invalid price
      response = await request(app.getHttpServer())
        .put(`/products/${product.id}`)
        .send({
          name: 'Another Product Name',
          description: 'Description with invalid price',
          image: 'http://example.com/another-image.png',
          price: -10, // Invalid price
        });

      // Then the response status code should be 400
      expect(response.statusCode).toBe(400);
    });

    it('should return a 404 status code when updating a non-existent product', async () => {
      // When I send a PUT request to "/products/:nonExistentId"
      response = await request(app.getHttpServer())
        .put('/products/non-existent-id')
        .send({
          name: 'Non-existent Product',
          description: 'Trying to update a non-existent product',
          image: 'http://example.com/non-existent-image.png',
          price: 40,
        });

      // Then the response status code should be 404
      expect(response.statusCode).toBe(404);
    });
  });
});
