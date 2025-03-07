import { z } from 'zod';

export const collectionSchema = z.object({
  id: z.number(),
  address: z.string(),
  uri: z.string(),
  name: z.string(),
  tenant: z.enum(['CEREFANS', 'DAVINCI']),
});
export type Collection = z.infer<typeof collectionSchema>;
