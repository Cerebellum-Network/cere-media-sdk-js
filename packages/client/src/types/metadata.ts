import { z } from 'zod';

export const nftAssetSchema = z.object({
  name: z.string(),
  description: z.string(),
  asset: z.string(),
  preview: z.string(),
  contentType: z.string(),
});
export type NftAsset = z.infer<typeof nftAssetSchema>;

export const nftMetadataSchema = z.object({
  name: z.string(),
  description: z.string(),
  preview: z.string(),
  assets: z.array(nftAssetSchema),
});
export type NftMetadata = z.infer<typeof nftMetadataSchema>;
