import { z } from 'zod';

import { collectionSchema } from './collection';

export const nftSchema = z.object({
  id: z.number({ coerce: true }),
  nftId: z.number({ coerce: true }),
  supply: z.number({ coerce: true }),
  collection: collectionSchema,
});
export type NFT = z.infer<typeof nftSchema>;

type MultimediaContentType =
  | 'image/jpeg'
  | 'image/png'
  | 'image/gif'
  | 'audio/mpeg'
  | 'audio/wav'
  | 'audio/ogg'
  | 'video/mp4'
  | 'video/quicktime'
  | 'video/x-msvideo';

export const freeportNftAssetSchema = z.object({
  name: z.string(),
  description: z.string(),
  preview: z.string(),
  asset: z.string(),
  contentType: z.custom<MultimediaContentType>(),
});
export type FreeportNftAsset = z.infer<typeof freeportNftAssetSchema>;
