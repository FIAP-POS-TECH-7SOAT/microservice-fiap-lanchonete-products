import { Product } from '@core/modules/products/entities/product';
import { ProductRepository } from '../ports/repositories/product-repository';
import { Injectable } from '@nestjs/common';
import { Either, right } from '@core/common/entities/either';

interface RequestProps {
  name: string;
  description: string;
  image: string;
  price: number;
}
type ResponseProps = Either<
  null,
  {
    product: Product;
  }
>;
@Injectable()
export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}
  async execute({
    description,
    image,
    name,
    price,
  }: RequestProps): Promise<ResponseProps> {
    const product = Product.create({
      description,
      image,
      name,
      price,
    });

    await this.productRepository.create(product);

    return right({
      product,
    });
  }
}
