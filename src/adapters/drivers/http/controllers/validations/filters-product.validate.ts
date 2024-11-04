import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const filtersProductSchema = z.object({
  status: z.union([z.string(), z.array(z.string())]).optional(),
});

export class FiltersProductProps extends createZodDto(filtersProductSchema) {}
