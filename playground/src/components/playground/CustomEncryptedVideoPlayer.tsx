import React, { useMemo, VideoHTMLAttributes } from 'react';
import { HlsEncryptionLoader, useMediaClient, useServerSideUrl } from '@cere/media-sdk-react';
import { CustomVideoPlayer } from './CustomVideoPlayer.tsx';

export interface EncryptedVideoPlayerProps {
  src: string;
  collectionAddress: string;
  nftId: number;
  assetIndex: number;
  serverSide?: boolean;
  className?: string;
  loadingComponent?: React.ReactNode;
  videoOverrides?: VideoHTMLAttributes<HTMLVideoElement>;
}
export const CustomEncryptedVideoPlayer = ({
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
    return <CustomVideoPlayer hlsEnabled src={url} {...props} />;
  }

  return <CustomVideoPlayer src={src} loader={loader} {...props} />;
};
