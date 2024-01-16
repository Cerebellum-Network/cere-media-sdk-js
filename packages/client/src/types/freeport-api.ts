import { z } from 'zod';

export interface FreeportApiClientOptions {
  freeportApiUrl: string;
  logger?: boolean;
  skipInitialHealthCheck?: boolean;
}

export type AuthHeaderKeys = 'x-message' | 'x-signature' | 'x-public-key';
export type AuthHeaders = Record<AuthHeaderKeys, string>;

export const getAuthMessageRequestSchema = z.object({
  address: z.string(),
});
export type GetAuthMessageRequest = z.infer<typeof getAuthMessageRequestSchema>;
export const getAuthMessageResponseSchema = z.string();
export type GetAuthMessageResponse = z.infer<typeof getAuthMessageResponseSchema>;
