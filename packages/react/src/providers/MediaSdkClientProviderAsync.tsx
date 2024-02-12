import { MediaClientOptions } from '@cere/media-sdk-client';
import { Signer } from 'ethers';
import React from 'react';
import useSWR from 'swr';

import { MediaSdkClientProvider } from '..';

export interface MediaSdkClientProviderAsyncProps {
  getSigner: () => Promise<Signer>;
  options?: MediaClientOptions;
  swrConfig?: Record<string, unknown>;
  children: React.ReactNode;
}

export const MediaSdkClientProviderAsync = ({ getSigner, ...props }: MediaSdkClientProviderAsyncProps) => {
  const { data: signer } = useSWR('signer', () => {
    return getSigner();
  });

  return <MediaSdkClientProvider signer={signer} {...props} />;
};
