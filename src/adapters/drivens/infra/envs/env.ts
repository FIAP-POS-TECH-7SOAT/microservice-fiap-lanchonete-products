import { z } from 'zod';

export const schemaEnv = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().optional().default(3000),
});

export type Env = z.infer<typeof schemaEnv>;
