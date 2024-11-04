import { Module } from '@nestjs/common';

import { CreateProductUseCase } from './application/use-case/create-product.use-case';
import { FindProductByIdUseCase } from './application/use-case/find-product-by-id.use-case';
import { UpdateProductByIdUseCase } from './application/use-case/update-product-by-id.use-case';

import { ListAllProductsByFiltersUseCase } from './application/use-case/list-all-products-by-filters.use-case';

@Module({
  imports: [],
  controllers: [],
  providers: [
    CreateProductUseCase,
    FindProductByIdUseCase,
    UpdateProductByIdUseCase,
    ListAllProductsByFiltersUseCase,
  ],
  exports: [
    CreateProductUseCase,
    FindProductByIdUseCase,
    UpdateProductByIdUseCase,
    ListAllProductsByFiltersUseCase,
  ],
})
export class ProductModule {}
