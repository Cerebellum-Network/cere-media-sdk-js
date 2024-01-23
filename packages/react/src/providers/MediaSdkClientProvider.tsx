import { MediaClientOptions, defaultMediaClientOptions } from '@cere-media-sdk/client';
import { PropsWithChildren, useMemo } from 'react';
import { useStaticMediaClient } from '..';
import { MediaSdkClientContext } from './MediaSdkClientContext';
import { Signer } from 'ethers';

export interface MediaSdkClientProviderProps extends PropsWithChildren {
  signer?: Signer;
  options?: MediaClientOptions;
}

export const MediaSdkClientProvider = ({
  children,
  signer,
  options = defaultMediaClientOptions,
}: MediaSdkClientProviderProps) => {
  const client = useStaticMediaClient(signer, options);

  const values: MediaSdkClientContext = useMemo(() => ({ ...client }), [client]);

  return <MediaSdkClientContext.Provider value={values}>{children}</MediaSdkClientContext.Provider>;
};
