import { z } from 'zod';

import { collectionSchema } from './collection';

export const nftSchema = z.object({
  id: z.number({ coerce: true }),
  nftId: z.number({ coerce: true }),
  supply: z.number({ coerce: true }),
  collection: collectionSchema,
});
export type NFT = z.infer<typeof nftSchema>;
