import { Module } from '@nestjs/common';

import { ProductController } from './controllers/product-controller';
import { InfoController } from './controllers/info-controller';

import DatabaseModule from '@adapters/drivens/infra/database/prisma/database.module';
import { ProductModule } from '@core/modules/products/product.module';

@Module({
  imports: [DatabaseModule, ProductModule],
  controllers: [ProductController, InfoController],
})
export class HTTPModule {}
