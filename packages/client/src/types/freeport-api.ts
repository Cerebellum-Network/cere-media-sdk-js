import { Signer } from 'ethers';
import { z } from 'zod';

import { ChainNamespace } from './chain-namespace';
import { collectionSchema } from './collection';
import { nftSchema } from './nft';

export interface FreeportApiClientOptions {
  freeportApiUrl: string;
  logger?: boolean;
  skipInitialHealthCheck?: boolean;
  chainId: string;
  chainNamespace: ChainNamespace;
  signer?: Signer;
}

export type AuthHeaderKeys = 'x-message' | 'x-signature' | 'x-public-key';
export type AuthHeaders = Record<AuthHeaderKeys, string>;

export type ChainHeaderKeys = 'chain-namespace' | 'chain-id';
export type ChainHeaders = Record<ChainHeaderKeys, string>;

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

export const getCanAccessRequestSchema = z.object({
  collectionAddress: z.string(),
  walletAddress: z.string(),
  nftId: z.number(),
});
export type GetCanAccessRequest = z.infer<typeof getCanAccessRequestSchema>;

export const getCanAccessResponseSchema = z.boolean();
export type GetCanAccessResponse = z.infer<typeof getCanAccessResponseSchema>;

export const getContentDekRequest = z.object({
  collectionAddress: z.string(),
  nftId: z.number(),
  asset: z.string(),
});
export type GetContentDekRequest = z.infer<typeof getContentDekRequest>;

export const getContentDekResponse = z.string();
export type GetContentDekResponse = z.infer<typeof getContentDekResponse>;

export const getContentRequest = z.object({
  collectionAddress: z.string(),
  nftId: z.number(),
  asset: z.string(),
  chainId: z.string(),
  chainNamespace: z.nativeEnum(ChainNamespace),
});
export type GetContentRequest = z.infer<typeof getContentRequest>;

export type GetContentResponse = Blob;

export const getStreamKeyRequest = z.object({
  collectionAddress: z.string(),
  nftId: z.number(),
  bucketId: z.number(),
  cid: z.string(),
});
export type GetStreamKeyRequest = z.infer<typeof getStreamKeyRequest>;
export const getStreamKeyResponse = z.string();
export type GetStreamKeyResponse = z.infer<typeof getStreamKeyResponse>;
