import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string(),
  price: z.number().positive().default(0),
  description: z.string(),
  image: z.string(),
});

export class CreateProductProps extends createZodDto(createProductSchema) {}
