import { MediaClientOptions, MediaSdkClient, Web3authChainNamespace } from '@cere/media-sdk-client';
import { Signer } from 'ethers';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import { UseMediaClientReturn } from '../types';

/**
 * Creates a new instance of the media client. Only use this if not using the MediaSdkClientProvider.
 */
export const useStaticMediaClient = (
  chainId: string,
  chainNamespace: Web3authChainNamespace,
  signer: Signer,
  options?: MediaClientOptions,
): UseMediaClientReturn => {
  const [address, setAddress] = useState<string | null>(null);
  const createClient = async () => {
    if (!signer) return;
    return MediaSdkClient.create(chainId, chainNamespace, signer, options);
  };

  useEffect(() => {
    const getAddress = async () => {
      try {
        const address = await signer.getAddress();
        setAddress(address);
      } catch (error) {
        console.error('Failed to get address:', error);
      }
    };

    getAddress();
  }, [signer]);

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
