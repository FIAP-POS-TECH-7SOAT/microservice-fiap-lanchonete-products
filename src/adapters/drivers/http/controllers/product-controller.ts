import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';

import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import {
  CreateProductProps,
  createProductSchema,
  filtersProductSchema,
  UpdateProductProps,
  updateProductSchema,
} from './validations';

import { LoggingInterceptor } from '../Interceptors/custom-logger-routes';

import { CreateProductUseCase } from '@core/modules/products/application/use-case/create-product.use-case';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UpdateProductByIdUseCase } from '@core/modules/products/application/use-case/update-product-by-id.use-case';
import { FindProductByIdUseCase } from '@core/modules/products/application/use-case/find-product-by-id.use-case';

import { ResourceNotFoundError } from '@core/modules/products/application/errors/resource-not-found-error';
import { ListAllProductsByFiltersUseCase } from '@core/modules/products/application/use-case/list-all-products-by-filters.use-case';
import { ProductMapping } from '../mapping/product-mapping';

@Controller('/products')
@ApiTags('Products')
@ApiBearerAuth()
@UseInterceptors(LoggingInterceptor)
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly listAllProductsByFiltersUseCase: ListAllProductsByFiltersUseCase,
    private readonly updateProductByIdUseCase: UpdateProductByIdUseCase,
    private readonly findProductByIdUseCase: FindProductByIdUseCase,
  ) {}

  @Post('/')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createProductSchema))
  async create(@Body() body: CreateProductProps) {
    const { description, image, name, price } = body;

    const result = await this.createProductUseCase.execute({
      description,
      image,
      name,
      price,
    });
    if (result.isLeft()) {
      throw new Error('');
    }
    return {
      product: ProductMapping.toView(result.value.product),
    };
  }

  @Put('/:id')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(updateProductSchema))
  async updateByProductId(
    @Body() body: UpdateProductProps,
    @Param('id') id: string,
  ) {
    const { description, image, name, price } = body;
    const result = await this.updateProductByIdUseCase.execute({
      id,
      description,
      image,
      name,
      price,
    });
    if (result.isLeft()) {
      if (result.value instanceof ResourceNotFoundError) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    return {
      product: ProductMapping.toView(result.value.product),
    };
  }

  @Get('/')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(filtersProductSchema))
  async listAllProducts() {
    const result = await this.listAllProductsByFiltersUseCase.execute({
      filters: {
        status: [],
      },
    });
    if (result.isLeft()) {
      throw new Error('');
    }
    return {
      products: result.value.products.map(ProductMapping.toView),
    };
  }

  @Get('/:id')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(filtersProductSchema))
  async getOneById(@Param('id') id: string) {
    const result = await this.findProductByIdUseCase.execute({ id });
    if (result.isLeft()) {
      if (result.value instanceof ResourceNotFoundError) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    return {
      product: ProductMapping.toView(result.value.product),
    };
  }
}
