import { MediaSdkClient } from '@cere-media-sdk/client';

export interface UseMediaClientReturn {
  client?: MediaSdkClient;
  error?: any;
  isLoading: boolean;
}
