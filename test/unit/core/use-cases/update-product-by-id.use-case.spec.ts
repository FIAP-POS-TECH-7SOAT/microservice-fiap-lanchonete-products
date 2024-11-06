import { ProductRepository } from '@core/modules/products/application/ports/repositories/product-repository';
import { UpdateProductByIdUseCase } from '@core/modules/products/application/use-case/update-product-by-id.use-case';

import { ResourceNotFoundError } from '@core/modules/products/application/errors/resource-not-found-error';
import { productFactory } from '@test/factory/product-factory';
import { FakeProductRepository } from '../repositories/fake-product-repository';

describe(UpdateProductByIdUseCase.name, () => {
  let productRepository: ProductRepository;

  let sut: UpdateProductByIdUseCase;

  beforeEach(() => {
    productRepository = new FakeProductRepository();
    sut = new UpdateProductByIdUseCase(productRepository);
  });

  it('should update product by id', async () => {
    const myProduct = productFactory({}, 'fake_id_1');

    await productRepository.create(myProduct);

    const result = await sut.execute({
      id: 'fake_id_1',
      name: 'name-updated',
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
    }
  });
  it('should not update a product by id when the product do not exist', async () => {
    const fixedDate = new Date('2024-10-20T10:00:00Z');
    jest.useFakeTimers();
    jest.setSystemTime(fixedDate);

    const result = await sut.execute({
      id: 'fake-id',
      name: 'name-updated',
    });

    expect(result.isLeft()).toBeTruthy();
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });
});
