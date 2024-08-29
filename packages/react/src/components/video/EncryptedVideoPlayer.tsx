import { NFT } from '@cere/media-sdk-client';
import React, { VideoHTMLAttributes, useState, useEffect } from 'react';

import { useEncryptedContent, useMediaClient, useNftMetadata, useServerSideUrl } from '../../hooks';

import { createHlsEncryptionLoader } from './HlsEncryptionLoader';
import { IosVideoPlayer } from './IosVideoPlayer';
import { VideoPlayer } from './VideoPlayer';

export interface EncryptedVideoPlayerProps {
  src: string;
  collectionAddress: string;
  nftId: number;
  assetIndex?: number;
  serverSide?: boolean;
  className?: string;
  loadingComponent?: React.ReactNode;
  videoOverrides?: VideoHTMLAttributes<HTMLVideoElement>;
}

export const EncryptedVideoPlayer = ({
  src,
  collectionAddress,
  nftId,
  assetIndex = 0,
  serverSide,
  ...props
}: EncryptedVideoPlayerProps) => {
  const { client } = useMediaClient();
  const { url } = useServerSideUrl({ src, collectionAddress, nftId });
  const { metadata } = useNftMetadata(collectionAddress, nftId);
  const nft = {
    collection: { address: collectionAddress },
    nftId,
  } as NFT;
  const { asset } = useEncryptedContent(nft, metadata!, assetIndex);
  const assetCid = asset.asset.split('/').pop();

  const [loader, setLoader] = useState<any>(null);

  useEffect(() => {
    const initializeLoader = async () => {
      if (client) {
        const loaderInstance = await createHlsEncryptionLoader({
          collectionAddress,
          nftId,
          assetId: `asset-${assetCid}`,
          client,
        });
        setLoader(() => loaderInstance); // Set the loader instance once it's ready
      }
    };

    initializeLoader();
  }, [client]);

  if (!client) {
    return <></>;
  }

  if (serverSide && url) {
    return <IosVideoPlayer hlsEnabled src={url} {...props} loader={loader} />;
  }

  return <VideoPlayer src={src} loader={loader} {...props} />;
};
