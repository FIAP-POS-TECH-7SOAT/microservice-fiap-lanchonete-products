import { Product } from '@core/modules/products/entities/product';
import { GetAllFiltersDTO } from './dtos/product-dto';

export abstract class ProductRepository {
  abstract create(data: Product): Promise<Product>;
  abstract findById(id: string): Promise<Product | null>;
  abstract getAll(data: GetAllFiltersDTO): Promise<Product[]>;
  abstract update(data: Product): Promise<Product>;
}
