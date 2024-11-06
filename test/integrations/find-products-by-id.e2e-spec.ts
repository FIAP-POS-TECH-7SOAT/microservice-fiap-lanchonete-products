import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../../src/app.module';
import { PrismaService } from '@adapters/drivens/infra/database/prisma/prisma.service';
import { UniqueEntityID } from '@core/common/entities/unique-entity-id';

describe('GET /products/:id - Product retrieval feature', () => {
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

  describe('Scenario: Retrieving an existing product by ID', () => {
    it('should retrieve a product successfully', async () => {
      const productId = new UniqueEntityID();
      // Given I alredy have a product created in DB
      await prisma.product.create({
        data: {
          name: 'Test Product',
          description: 'Description for Test Product',
          image: 'http://example.com/image.png',
          price: 50,
          created_at: new Date(),
          id: productId.toString(),
        },
      });
      // When I send a GET request to "/products/:id" with a valid ID
      response = await request(app.getHttpServer()).get(
        `/products/${productId}`,
      );

      // Then the response status code should be 200
      expect(response.statusCode).toBe(200);

      // And the product details should be correct
      expect(response.body).toEqual({
        product: {
          id: productId.toString(),
          name: 'Test Product',
          description: 'Description for Test Product',
          image: 'http://example.com/image.png',
          price: '50',
          created_at: response.body.product.created_at,
        },
      });
    });
  });

  describe('Scenario: Retrieving a non-existing product by ID', () => {
    it("should return a 404 status code if the product doesn't exist", async () => {
      // When I send a GET request to "/products/:id" with a non-existing ID
      response = await request(app.getHttpServer()).get(
        `/products/non-existing-id`,
      );

      // Then the response status code should be 404
      expect(response.statusCode).toBe(404);
    });
  });
});
