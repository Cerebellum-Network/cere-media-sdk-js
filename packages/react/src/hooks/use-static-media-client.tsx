import { MediaClientOptions, MediaSdkClient } from '@cere-media-sdk/client';
import { Signer } from 'ethers';
import useSWR from 'swr';

import { UseMediaClientReturn } from '../types';

/**
 * Creates a new instance of the media client. Only use this if not using the MediaSdkClientProvider.
 */
export const useStaticMediaClient = (signer?: Signer, options?: MediaClientOptions): UseMediaClientReturn => {
  const createClient = async () => {
    if (!signer) return;
    return MediaSdkClient.create(signer, options);
  };

  const { data: address } = useSWR(['address'], signer?.getAddress || (() => undefined));

  const { data, error, isLoading } = useSWR(['media-client', address, options], createClient, {
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
