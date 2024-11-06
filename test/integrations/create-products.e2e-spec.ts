import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../../src/app.module';
import { PrismaService } from '@adapters/drivens/infra/database/prisma/prisma.service';

describe('POST /products: Product creation feature', () => {
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

  describe('Scenario: Creating a product with valid details', () => {
    it('should create a new product successfully', async () => {
      // Quando envio uma requisição POST para "/products" com detalhes válidos do produto
      response = await request(app.getHttpServer()).post('/products').send({
        name: 'Product Test',
        description: 'Description for Product Test',
        image: 'http://example.com/image.png',
        price: 50,
      });

      // Então o código de resposta deve ser 201
      expect(response.statusCode).toBe(201);

      // E o produto deve estar salvo no banco de dados
      const productDb = await prisma.product.findFirst({
        where: { name: 'Product Test' },
      });

      expect(productDb).toBeDefined();
      expect(productDb?.name).toBe('Product Test');
      expect(Number(productDb?.price)).toBe(50);
    });
  });

  describe('Scenario: Creating a product with invalid details', () => {
    it("shouldn't create a product with missing required fields", async () => {
      // Quando envio uma requisição POST para "/products" sem campos obrigatórios
      response = await request(app.getHttpServer()).post('/products').send({
        description: 'Description for Product Test',
        price: 50,
      });

      // Então o código de resposta deve ser 400
      expect(response.statusCode).toBe(400);
    });

    it("shouldn't create a product with invalid price format", async () => {
      // Quando envio uma requisição POST para "/products" com preço inválido
      response = await request(app.getHttpServer()).post('/products').send({
        name: 'Product Test',
        description: 'Description for Product Test',
        image: 'http://example.com/image.png',
        price: 'invalid-price',
      });

      // Então o código de resposta deve ser 400
      expect(response.statusCode).toBe(400);
    });
  });
});
