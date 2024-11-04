import { ProductRepository } from '../ports/repositories/product-repository';

import { Product } from '@core/modules/products/entities/product';
import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@core/common/entities/either';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';

interface RequestProps {
  id: string;
}

interface FindProductByIdUseCaseResponse {
  product: Product;
}
type ResponseProps = Either<
  ResourceNotFoundError,
  FindProductByIdUseCaseResponse
>;

@Injectable()
export class FindProductByIdUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  public async execute({ id }: RequestProps): Promise<ResponseProps> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      return left(new ResourceNotFoundError());
    }
    return right({
      product,
    });
  }
}
