import { Product } from '@core/modules/products/entities/product';
import { ProductRepository } from '../ports/repositories/product-repository';
import { Injectable } from '@nestjs/common';
import { Either, right } from '@core/common/entities/either';

interface RequestProps {
  filters: {
    status: string[];
  };
}
type ResponseProps = Either<
  null,
  {
    products: Product[];
  }
>;

@Injectable()
export class ListAllProductsByFiltersUseCase {
  constructor(private readonly productRepository: ProductRepository) {}
  async execute({ filters }: RequestProps): Promise<ResponseProps> {
    const products = await this.productRepository.getAll({ filters });

    return right({ products });
  }
}
