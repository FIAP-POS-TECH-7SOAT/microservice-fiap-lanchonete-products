import { FakeProductRepository } from '../repositories/fake-product-repository';
import { ProductRepository } from '@core/modules/products/application/ports/repositories/product-repository';

import { CreateProductUseCase } from '@core/modules/products/application/use-case/create-product.use-case';

import { faker } from '@faker-js/faker/.';

describe(CreateProductUseCase.name, () => {
  let productRepository: ProductRepository;

  let sut: CreateProductUseCase;

  beforeEach(() => {
    productRepository = new FakeProductRepository();

    sut = new CreateProductUseCase(productRepository);
  });

  it('should create a product', async () => {
    const result = await sut.execute({
      description: faker.food.description(),
      image: faker.image.url(),
      name: faker.food.dish(),
      price: Number(faker.commerce.price({ dec: 2 })),
    });
    const products = await productRepository.getAll();
    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.product.id.toString()).toBeTruthy();
      expect(products[0].id).toEqual(result.value.product.id);
    }
  });
});
