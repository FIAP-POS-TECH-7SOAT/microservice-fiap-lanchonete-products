import { FakeProductRepository } from '../repositories/fake-product-repository';
import { ProductRepository } from '@core/modules/products/application/ports/repositories/product-repository';
import { FindProductByIdUseCase } from '@core/modules/products/application/use-case/find-product-by-id.use-case';

import { ResourceNotFoundError } from '@core/modules/products/application/errors/resource-not-found-error';
import { productFactory } from '@test/factory/product-factory';

describe(FindProductByIdUseCase.name, () => {
  let productRepository: ProductRepository;

  let sut: FindProductByIdUseCase;

  beforeEach(() => {
    productRepository = new FakeProductRepository();
    sut = new FindProductByIdUseCase(productRepository);
  });

  it('should return a product by id', async () => {
    const myProduct = productFactory({}, '1');

    await productRepository.create(myProduct);

    const result = await sut.execute({
      id: '1',
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.product.id.toString()).toEqual('1');
    }
  });

  it('should not find a product by id when the product do not exist', async () => {
    const fixedDate = new Date('2024-10-20T10:00:00Z');
    jest.useFakeTimers();
    jest.setSystemTime(fixedDate);

    const result = await sut.execute({
      id: 'fake-id',
    });

    expect(result.isLeft()).toBeTruthy();
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });
});
