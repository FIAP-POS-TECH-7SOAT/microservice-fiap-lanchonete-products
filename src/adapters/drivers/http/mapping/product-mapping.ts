import { Product } from '@core/modules/products/entities/product';

export class ProductMapping {
  static toView({ id, created_at, description, image, name, price }: Product) {
    return {
      id: id.toString(),

      created_at,
      description,
      image,
      name,
      price,
    };
  }
}
