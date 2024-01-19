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

  const { data: address } = useSWR(['address'], signer?.getAddress || (() => undefined));

  const { data, error, isLoading } = useSWR(['media-client', address], createClient, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
    refreshInterval: 0,
  });

  return {
    client: data as MediaSdkClient,
    error,
    isLoading,
  };
};
