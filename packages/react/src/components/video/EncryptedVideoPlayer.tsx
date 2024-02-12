import React, { useMemo } from 'react';

import { useMediaClient, useServerSideUrl } from '../../hooks';

import { HlsEncryptionLoader } from './HlsEncryptionLoader';
import { VideoPlayer } from './VideoPlayer';

export interface EncryptedVideoPlayerProps {
  src: string;
  collectionAddress: string;
  nftId: number;
  assetIndex: number;
  serverSide?: boolean;
  className?: string;
  loadingComponent?: React.ReactNode;
}

export const EncryptedVideoPlayer = ({
  src,
  collectionAddress,
  nftId,
  assetIndex,
  serverSide,
  ...props
}: EncryptedVideoPlayerProps) => {
  const { client } = useMediaClient();
  const { url } = useServerSideUrl({ src, collectionAddress, nftId });

  const loader = useMemo(() => {
    return client
      ? HlsEncryptionLoader.create({
          collectionAddress,
          nftId,
          assetId: `asset-${assetIndex}`,
          client,
        })
      : undefined;
  }, [collectionAddress, nftId, assetIndex, client]);

  if (!client) {
    return <></>;
  }

  if (serverSide && url) {
    return <VideoPlayer src={url} {...props} />;
  }

  return <VideoPlayer src={src} loader={loader} {...props} />;
};
