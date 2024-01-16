import { z } from 'zod';

import { collectionSchema } from './collection';
import { nftSchema } from './nft';

export interface FreeportApiClientOptions {
  freeportApiUrl: string;
  logger?: boolean;
  skipInitialHealthCheck?: boolean;
}

export type AuthHeaderKeys = 'x-message' | 'x-signature' | 'x-public-key';
export type AuthHeaders = Record<AuthHeaderKeys, string>;

export const getAuthMessageResponseSchema = z.string();
export type GetAuthMessageResponse = z.infer<typeof getAuthMessageResponseSchema>;

export const getByAddressRequestSchema = z.object({
  address: z.string(),
});
export type GetByAddressRequest = z.infer<typeof getByAddressRequestSchema>;

export const getCollectionsResponseSchema = z.array(collectionSchema);
export type GetCollectionsResponse = z.infer<typeof getCollectionsResponseSchema>;

export const getNftsResponseSchema = z.array(nftSchema);
export type GetNftsResponse = z.infer<typeof getNftsResponseSchema>;
