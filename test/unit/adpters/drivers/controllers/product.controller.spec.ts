import { Test, TestingModule } from '@nestjs/testing';

import { HttpStatus, HttpException } from '@nestjs/common';
import { CreateProductUseCase } from '@core/modules/products/application/use-case/create-product.use-case';
import { ListAllProductsUseCase } from '@core/modules/products/application/use-case/list-all-products.use-case';
import { UpdateProductByIdUseCase } from '@core/modules/products/application/use-case/update-product-by-id.use-case';
import { FindProductByIdUseCase } from '@core/modules/products/application/use-case/find-product-by-id.use-case';

import { ResourceNotFoundError } from '@core/modules/products/application/errors/resource-not-found-error';
import { ProductController } from '@adapters/drivers/http/controllers/product-controller';
import { ProductMapping } from '@adapters/drivers/http/mapping/product-mapping';

import { left, right } from '@core/common/entities/either';

import { faker } from '@faker-js/faker/.';
import { productFactory } from '@test/factory/product-factory';

describe('ProductController', () => {
  let controller: ProductController;
  let createProductUseCase: CreateProductUseCase;
  let listAllProductsUseCase: ListAllProductsUseCase;
  let updateProductByIdUseCase: UpdateProductByIdUseCase;
  let findProductByIdUseCase: FindProductByIdUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: CreateProductUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: ListAllProductsUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: UpdateProductByIdUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: FindProductByIdUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    createProductUseCase =
      module.get<CreateProductUseCase>(CreateProductUseCase);
    listAllProductsUseCase = module.get<ListAllProductsUseCase>(
      ListAllProductsUseCase,
    );
    updateProductByIdUseCase = module.get<UpdateProductByIdUseCase>(
      UpdateProductByIdUseCase,
    );
    findProductByIdUseCase = module.get<FindProductByIdUseCase>(
      FindProductByIdUseCase,
    );
  });

  describe('create', () => {
    it('should create an product and return its view', async () => {
      const productData = {
        description: faker.food.description(),
        image: faker.image.url(),
        name: faker.food.dish(),
        price: Number(faker.commerce.price({ dec: 2 })),
      };

      const product = productFactory({});
      const expectedProduct = {
        product: ProductMapping.toView(product),
      };

      jest.spyOn(createProductUseCase, 'execute').mockResolvedValueOnce(
        right({
          product: product,
        }),
      );

      const result = await controller.create(productData);

      expect(result).toEqual(expectedProduct);
      expect(createProductUseCase.execute).toHaveBeenCalledWith(productData);
    });

    it('should throw an error if createProductUseCase fails', async () => {
      jest
        .spyOn(createProductUseCase, 'execute')
        .mockResolvedValueOnce(left(null));

      await expect(
        controller.create({
          description: faker.food.description(),
          image: faker.image.url(),
          name: faker.food.dish(),
          price: Number(faker.commerce.price({ dec: 2 })),
        }),
      ).rejects.toThrow(Error);
    });
  });

  describe('updateByProductId', () => {
    it('should update an product by id and return its view', async () => {
      const id = '1';
      const updateData = {
        name: 'name-updated',
      };
      const product = productFactory({}, '1');

      const expectedProduct = {
        product: ProductMapping.toView(product),
      };
      jest.spyOn(updateProductByIdUseCase, 'execute').mockResolvedValueOnce(
        right({
          product: product,
        }),
      );

      const result = await controller.updateByProductId(updateData, id);

      expect(result).toEqual(expectedProduct);
      expect(updateProductByIdUseCase.execute).toHaveBeenCalledWith({
        id,
        name: 'name-updated',
      });
    });

    it('should throw NOT_FOUND if the product does not exist', async () => {
      const id = '1';
      jest
        .spyOn(updateProductByIdUseCase, 'execute')
        .mockResolvedValueOnce(left(new ResourceNotFoundError()));

      await expect(
        controller.updateByProductId({ name: 'updated' }, id),
      ).rejects.toThrow(
        new HttpException('Product not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('listAllProducts', () => {
    it('should return all products', async () => {
      const products = [productFactory({}), productFactory({})];
      jest
        .spyOn(listAllProductsUseCase, 'execute')
        .mockResolvedValueOnce(right({ products }));

      const result = await controller.listAllProducts();

      expect(result).toEqual({ products: products.map(ProductMapping.toView) });
      expect(listAllProductsUseCase.execute).toHaveBeenCalledWith();
    });
  });

  describe('getOneById', () => {
    it('should return a single product by ID', async () => {
      const productMock = productFactory({});
      findProductByIdUseCase.execute = jest
        .fn()
        .mockResolvedValue(right({ product: productMock }));

      const result = await controller.getOneById(productMock.id.toString());

      expect(result).toEqual({ product: ProductMapping.toView(productMock) });
    });

    it('should throw a 404 error if the product is not found', async () => {
      findProductByIdUseCase.execute = jest.fn().mockResolvedValue({
        isLeft: () => true,
        value: new ResourceNotFoundError(),
      });

      await expect(controller.getOneById('invalidId')).rejects.toThrow(
        new HttpException('Product not found', HttpStatus.NOT_FOUND),
      );
    });
  });
});
