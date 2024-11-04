import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const updateProductSchema = z.object({
  name: z.string().optional(),
  price: z.number().positive().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
});

export class UpdateProductProps extends createZodDto(updateProductSchema) {}
