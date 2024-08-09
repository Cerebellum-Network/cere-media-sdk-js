import { NFT, NftMetadata } from '@cere/media-sdk-client';
import React, { useCallback, useMemo, useState } from 'react';

import { EncryptedAudioPlayer, HlsEncryptionLoader, VideoPlayer } from '..';
import { useDownloadContent, useEncryptedContent, useMediaClient } from '../../hooks';
import './styles.css';

export interface ContentViewProps {
  nft: NFT;
  metadata: NftMetadata;
  assetIndex: number;
  loadingComponent?: React.ReactNode;
  classNames?: Partial<Record<'container' | 'content' | 'downloadContent' | 'imageBlock' | 'image', string>>;
  callback?: () => void;
  DownloadIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

const useCustomDownloadContent = ({
  cid,
  collectionAddress,
  nftId,
}: {
  cid: string;
  nftId: number;
  collectionAddress: string;
}) => {
  const { download } = useDownloadContent(
    { nftId: Number(nftId), collection: { address: collectionAddress } } as NFT,
    `asset-${cid}`,
  );

  return { download };
};

export const NftContentView: React.FC<ContentViewProps> = ({
  nft,
  metadata,
  assetIndex,
  loadingComponent,
  classNames,
  callback,
  DownloadIcon,
}) => {
  const [isLoadingAsset, setLoadingAsset] = useState(false);
  const { client, isLoading: isLoadingClient } = useMediaClient();
  const { content, isLoading, isVideo, contentType, asset } = useEncryptedContent(nft, metadata, assetIndex);

  const handleImageLoad = useCallback(() => {
    if (callback) {
      callback();
    }
  }, [callback]);

  const isStreamableAudio = !!contentType && contentType.includes('audio');

  const assetCid = asset.asset.split('/').pop();
  const loader = useMemo(
    () =>
      isVideo && !!client
        ? HlsEncryptionLoader.create({
            collectionAddress: nft.collection.address,
            nftId: nft.nftId,
            assetId: `asset-${assetCid}`,
            client,
          })
        : undefined,
    [nft, assetIndex, isVideo],
  );

  const { download } = useCustomDownloadContent({
    nftId: Number(nft.nftId),
    collectionAddress: nft.collection.address!,
    cid: assetCid!,
  });

  const handleOnDownload = useCallback(async () => {
    setLoadingAsset(true);
    try {
      if (download) {
        await download();
        setLoadingAsset(false);
      }
    } catch (e) {
      console.log('An error occurred while loading an asset. Try again later');
      setLoadingAsset(false);
    }
  }, [download]);

  const renderContent = useMemo(() => {
    if (!isVideo && !isStreamableAudio) {
      return (
        <div className={classNames?.imageBlock || ''}>
          {!content ? (
            loadingComponent ? (
              loadingComponent
            ) : (
              <div className="loading-container">Loading...</div>
            )
          ) : (
            <img
              className={classNames?.image || ''}
              alt={asset?.name}
              src={content}
              width="100%"
              height="100%"
              onLoad={handleImageLoad}
            />
          )}
        </div>
      );
    }
    if (isStreamableAudio) {
      return (
        <EncryptedAudioPlayer
          className={classNames?.container}
          nftId={nft.nftId}
          collectionAddress={nft.collection.address}
          assetIndex={assetIndex}
          loadingComponent={loadingComponent}
        />
      );
    }

    if (isVideo) {
      return (
        <VideoPlayer
          className={classNames?.container}
          src={asset.asset}
          loader={loader}
          hlsEnabled={true}
          loadingComponent={loadingComponent}
        />
      );
    }
  }, [isVideo, isStreamableAudio, content, loadingComponent, classNames, asset, handleImageLoad]);

  if (isLoading || isLoadingClient) {
    return <>{loadingComponent || <div>Loading...</div>}</>;
  }

  return (
    <div className="flex self-stretch">
      <div className={`w-full ${classNames?.content}`}>{renderContent}</div>
      {DownloadIcon && (
        <button className={classNames?.downloadContent || ''} onClick={handleOnDownload} disabled={isLoadingAsset}>
          {isLoadingAsset ? loadingComponent : <DownloadIcon />}
        </button>
      )}
    </div>
  );
};
