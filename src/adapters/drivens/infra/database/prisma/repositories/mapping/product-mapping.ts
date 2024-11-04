import { UniqueEntityID } from '@core/common/entities/unique-entity-id';
import { Product } from '@core/modules/products/entities/product';

import { Prisma } from '@prisma/client';

export class ProductMapping {
  static toDomain({ id, description, image, name, created_at, price }: any) {
    return Product.create(
      {
        description,
        image,
        name,
        price,
        created_at,
      },
      new UniqueEntityID(id),
    );
  }

  static toCreatePrisma(product: Product): Prisma.ProductCreateInput {
    return {
      id: product.id.toString(),
      description: product.description,
      image: product.image,
      name: product.name,
      created_at: product.created_at,
      price: product.price,
    };
  }
  static toPrisma(product: Product) {
    return {
      id: product.id.toString(),
      description: product.description,
      image: product.image,
      name: product.name,
      created_at: product.created_at,
      price: product.price,
    };
  }
}
