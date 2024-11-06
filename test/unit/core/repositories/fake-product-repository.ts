/* eslint-disable @typescript-eslint/no-unused-vars */
import { Product } from '@core/modules/products/entities/product';
import { ProductRepository } from '@core/modules/products/application/ports/repositories/product-repository';

import { ProductMapping } from '@adapters/drivens/infra/database/prisma/repositories/mapping/product-mapping';

interface ProductRepositoryProps {
  id: string;
  name: string;
  description: string;
  image: string;
  created_at: Date;

  price: number;
}
export class FakeProductRepository implements ProductRepository {
  private prisma: ProductRepositoryProps[] = [];
  constructor() {}
  async create(data: Product): Promise<Product> {
    const product = ProductMapping.toPrisma(data);
    this.prisma.push(product);

    return data;
  }
  async update(data: Product): Promise<Product> {
    const productIndex = this.prisma.findIndex(
      (item) => item.id === data.id.toString(),
    );
    if (productIndex >= 0) {
      const product = ProductMapping.toPrisma(data);
      this.prisma[productIndex] = product;
    }
    return data;
  }

  async findById(id: string): Promise<Product | null> {
    const product = this.prisma.find((item) => item.id.toString() === id);
    if (!product) {
      return null;
    }
    return ProductMapping.toDomain(product as any);
  }

  async getAll(): Promise<Product[]> {
    return this.prisma.map(ProductMapping.toDomain);
  }
}
