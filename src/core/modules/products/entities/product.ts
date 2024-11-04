import { Optional } from '@core/common/entities/optional';
import { UniqueEntityID } from '@core/common/entities/unique-entity-id';
import { Entity } from '@core/common/entities/entity';

export interface IProductProduct {
  id: string;
  amount: number;
}
export interface ProductClientProps {
  name: string;
  email: string;
  document: string;
}

export interface ProductProps {
  name: string;
  description: string;
  image: string;
  created_at: Date;

  price: number;
}

export class Product extends Entity<ProductProps> {
  static create(
    props: Optional<ProductProps, 'created_at'>,
    id?: UniqueEntityID,
  ) {
    const product = new Product(
      {
        ...props,

        created_at: props.created_at ?? new Date(),
      },
      id,
    );
    return product;
  }
  public get name() {
    return this.props.name;
  }
  public set name(name: string) {
    this.props.name = name;
  }

  public get description(): string {
    return this.props.description;
  }
  public set description(description: string) {
    this.props.description = description;
  }
  public set image(image: string) {
    this.props.image = image;
  }
  public get image() {
    return this.props.image;
  }
  public get created_at() {
    return this.props.created_at;
  }

  public get price(): number {
    return this.props.price;
  }
  public set price(price: number) {
    this.props.price = Number(price);
  }
}
