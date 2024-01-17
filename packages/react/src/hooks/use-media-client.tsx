import { MediaClientOptions, MediaSdkClient } from '@cere-media-sdk/client';
import { Signer } from 'ethers';
import useSWR from 'swr';

export interface UseMediaClientReturn {
  client: MediaSdkClient;
}

export const useMediaClient = (signer?: Signer, options?: MediaClientOptions) => {
  const createClient = async () => {
    if (!signer) return;
    return MediaSdkClient.create(signer, options);
  };

  const { data, error, isLoading } = useSWR(['media-client', signer], createClient);

  return {
    client: data as MediaSdkClient,
    error,
    isLoading,
  };
};
