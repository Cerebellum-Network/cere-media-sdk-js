import { z } from 'zod';

import { collectionSchema } from './collection';

export const nftSchema = z.object({
  id: z.number(),
  nftId: z.number(),
  collection: collectionSchema,
});
export type NFT = z.infer<typeof nftSchema>;
