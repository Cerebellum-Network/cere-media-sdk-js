import { z } from 'zod';

export const collectionSchema = z.object({
  id: z.number(),
  address: z.string(),
  uri: z.string(),
  name: z.string(),
});
export type Collection = z.infer<typeof collectionSchema>;
