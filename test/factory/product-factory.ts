import { UniqueEntityID } from '@core/common/entities/unique-entity-id';
import { Product } from '@core/modules/products/entities/product';
import { faker } from '@faker-js/faker';

type ProductFactoryParams = Partial<{
  description: string;
  image: string;
  name: string;
  price: number;
}>;

export const productFactory = (
  params: ProductFactoryParams = {},
  id?: string,
) => {
  return Product.create(
    {
      description: params.description || faker.food.description(),
      image: params.image || faker.image.url(),
      name: params.name || faker.food.dish(),
      price: params.price ?? Number(faker.commerce.price({ dec: 2 })),
    },
    id ? new UniqueEntityID(id) : undefined,
  );
};
