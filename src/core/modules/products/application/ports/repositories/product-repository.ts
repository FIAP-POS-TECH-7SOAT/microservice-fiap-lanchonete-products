import { Product } from '@core/modules/products/entities/product';

export abstract class ProductRepository {
  abstract create(data: Product): Promise<Product>;
  abstract findById(id: string): Promise<Product | null>;
  abstract getAll(): Promise<Product[]>;
  abstract update(data: Product): Promise<Product>;
}
