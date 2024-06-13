import { ChainNamespace, MediaClientOptions } from '@cere/media-sdk-client';
import { Signer } from 'ethers';
import React from 'react';
import useSWR from 'swr';

import { MediaSdkClientProvider } from '..';

export interface MediaSdkClientProviderAsyncProps {
  chainId: string;
  chainNamespace: ChainNamespace;
  getSigner: () => Promise<Signer>;
  options?: MediaClientOptions;
  swrConfig?: Record<string, unknown>;
  children: React.ReactNode;
}

export const MediaSdkClientProviderAsync = ({
  getSigner,
  chainId,
  chainNamespace = ChainNamespace.EIP155,
  ...props
}: MediaSdkClientProviderAsyncProps) => {
  const { data: signer } = useSWR('signer', () => {
    return getSigner();
  });

  if (!signer) return;

  return <MediaSdkClientProvider signer={signer} chainId={chainId} chainNamespace={chainNamespace} {...props} />;
};
