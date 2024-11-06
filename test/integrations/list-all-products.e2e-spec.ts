import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../../src/app.module';
import { PrismaService } from '@adapters/drivens/infra/database/prisma/prisma.service';
import { randomUUID } from 'crypto';

describe('GET /products - Product listing feature', () => {
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
    await app.close();
  });

  describe('Scenario: Retrieving a list of all products', () => {
    it('should retrieve all products successfully', async () => {
      // Given It already have a products created in DB
      await prisma.product.createMany({
        data: [
          {
            name: 'Product 1',
            description: 'Description for Product 1',
            image: 'http://example.com/image1.png',
            price: 25,
            created_at: new Date(),
            id: randomUUID(),
          },
          {
            name: 'Product 2',
            description: 'Description for Product 2',
            image: 'http://example.com/image2.png',
            price: 50,
            created_at: new Date(),
            id: randomUUID(),
          },
        ],
      });
      // When I send a GET request to "/products"
      response = await request(app.getHttpServer()).get('/products');

      // Then the response status code should be 200
      expect(response.statusCode).toBe(200);

      // And the response body should contain an array of products
      const bodyProduct = response.body.products;
      expect(Array.isArray(bodyProduct)).toBe(true);
      expect(bodyProduct.length).toBeGreaterThanOrEqual(2);

      // Check that the products contain expected properties
      expect(bodyProduct).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'Product 1',
            description: 'Description for Product 1',
            image: 'http://example.com/image1.png',
            price: '25', // Adjusted to match the string format
          }),
          expect.objectContaining({
            name: 'Product 2',
            description: 'Description for Product 2',
            image: 'http://example.com/image2.png',
            price: '50', // Adjusted to match the string format
          }),
        ]),
      );
    });
  });
});
