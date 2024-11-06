import { ProductRepository } from '@core/modules/products/application/ports/repositories/product-repository';
import { PrismaService } from '../prisma.service';

import { Injectable } from '@nestjs/common';
import { Product } from '@core/modules/products/entities/product';
import { ProductMapping } from './mapping/product-mapping';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });
    if (!product) {
      return null;
    }
    return ProductMapping.toDomain(product);
  }

  async getAll(): Promise<Product[]> {
    const product = await this.prisma.product.findMany({
      orderBy: {
        created_at: 'asc',
      },
    });

    return product.map(ProductMapping.toDomain);
  }

  async update(product: Product): Promise<Product> {
    await Promise.all([
      this.prisma.product.update({
        where: {
          id: product.id.toString(),
        },
        data: ProductMapping.toPrisma(product),
      }),
    ]);

    return product;
  }

  async create(product: Product): Promise<Product> {
    await this.prisma.product.create({
      data: ProductMapping.toCreatePrisma(product),
    });

    return product;
  }
}
