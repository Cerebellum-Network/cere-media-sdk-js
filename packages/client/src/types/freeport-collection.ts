import { z } from 'zod';

import { Deployment, Tenant } from './client';

export interface FreeportCollectionOptions {
  deployment: Deployment;
  tenant: Tenant;
  logger?: boolean;
}

export const getNftMetadataRequestSchema = z.object({
  contractAddress: z.string(),
  nftId: z.number(),
});
export type GetNftMetadataRequest = z.infer<typeof getNftMetadataRequestSchema>;
