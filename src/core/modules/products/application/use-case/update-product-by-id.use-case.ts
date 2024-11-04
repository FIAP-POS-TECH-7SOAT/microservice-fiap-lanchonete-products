import { Product } from '@core/modules/products/entities/product';
import { ProductRepository } from '../ports/repositories/product-repository';

import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@core/common/entities/either';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
interface RequestProps {
  id: string;
  name?: string;
  description?: string;
  image?: string;
  price?: number;
}
type ResponseProps = Either<
  ResourceNotFoundError,
  {
    product: Product;
  }
>;

@Injectable()
export class UpdateProductByIdUseCase {
  constructor(private readonly productRepository: ProductRepository) {}
  async execute({
    id,
    description,
    image,
    name,
    price,
  }: RequestProps): Promise<ResponseProps> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      return left(new ResourceNotFoundError());
    }

    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.description = description ?? product.description;
    product.image = image ?? product.image;

    await this.productRepository.update(product);
    return right({ product });
  }
}
