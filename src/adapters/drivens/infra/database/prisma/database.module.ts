import { Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';

import { PrismaProductRepository } from './repositories/prisma-product-repository';
import { ProductRepository } from '@core/modules/products/application/ports/repositories/product-repository';

@Module({
  providers: [
    PrismaService,

    {
      provide: ProductRepository,
      useClass: PrismaProductRepository,
    },
  ],
  exports: [PrismaService, ProductRepository],
})
export default class DatabaseModule {}
