import { Product } from '@core/modules/products/entities/product';
import { ProductRepository } from '../ports/repositories/product-repository';
import { Injectable } from '@nestjs/common';
import { Either, right } from '@core/common/entities/either';

type ResponseProps = Either<
  null,
  {
    products: Product[];
  }
>;

@Injectable()
export class ListAllProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}
  async execute(): Promise<ResponseProps> {
    const products = await this.productRepository.getAll();

    return right({ products });
  }
}
