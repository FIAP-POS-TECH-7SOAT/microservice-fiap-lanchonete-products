import { ListAllProductsUseCase } from '@core/modules/products/application/use-case/list-all-products.use-case';
import { FakeProductRepository } from '../repositories/fake-product-repository';
import { ProductRepository } from '@core/modules/products/application/ports/repositories/product-repository';

import { productFactory } from '@test/factory/product-factory';

describe(ListAllProductsUseCase.name, () => {
  let productRepository: ProductRepository;
  let sut: ListAllProductsUseCase;

  beforeEach(() => {
    productRepository = new FakeProductRepository();
    sut = new ListAllProductsUseCase(productRepository);
  });

  it('should return an empty array of products when does not have products', async () => {
    const result = await sut.execute();

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.products).toHaveLength(0);
    }
  });

  it('should return all products ', async () => {
    await productRepository.create(productFactory());
    await productRepository.create(productFactory());
    const result = await sut.execute();

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.products).toHaveLength(2);
    }
  });
});
