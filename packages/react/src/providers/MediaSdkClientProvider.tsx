import { MediaClientOptions, defaultMediaClientOptions } from '@cere/media-sdk-client';
import { Signer } from 'ethers';
import React, { useMemo } from 'react';
import { SWRConfig } from 'swr';

import { useStaticMediaClient } from '..';

import { MediaSdkClientContext } from './MediaSdkClientContext';

const defaultSwrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshWhenOffline: false,
  refreshWhenHidden: false,
  refreshInterval: 0,
};

export interface MediaSdkClientProviderProps {
  signer?: Signer;
  options?: MediaClientOptions;
  swrConfig?: Record<string, unknown>;
  children: React.ReactNode;
}

export const MediaSdkClientProvider = ({
  children,
  signer,
  options = defaultMediaClientOptions,
  swrConfig = defaultSwrConfig,
}: MediaSdkClientProviderProps) => {
  const client = useStaticMediaClient(signer, options);

  const values: MediaSdkClientContext = useMemo(() => ({ ...client }), [client]);

  return (
    <MediaSdkClientContext.Provider value={values}>
      <SWRConfig value={swrConfig}>{children}</SWRConfig>
    </MediaSdkClientContext.Provider>
  );
};
