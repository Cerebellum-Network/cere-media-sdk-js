import { NFT, NftMetadata } from '@cere/media-sdk-client';
import { useMemo } from 'react';

import { EncryptedAudioPlayer, HlsEncryptionLoader, VideoPlayer } from '..';
import { useEncryptedContent, useMediaClient } from '../../hooks';

export interface ContentViewProps {
  /**
   * The NFT to display content for
   */
  nft: NFT;
  /**
   * The metadata of the NFT. This can be retrieved using the `useNftMetadata` hook
   */
  metadata: NftMetadata;
  /**
   * The index of the asset to view content for (starting at 0)
   */
  assetIndex: number;

  loadingComponent?: React.ReactNode;

  classNames?: Partial<Record<'container' | 'imageBlock' | 'image', string>>;
}

export const NftContentView = ({ nft, metadata, assetIndex, loadingComponent, classNames }: ContentViewProps) => {
  const { client, isLoading: isLoadingClient } = useMediaClient();
  const { content, isLoading, isVideo, contentType, asset } = useEncryptedContent(nft, metadata, assetIndex);

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

  if (isLoading || isLoadingClient) {
    return (
      <>
        {loadingComponent || (
          <div style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>Loading...</div>
        )}
      </>
    );
  }

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
          <img className={classNames?.image || ''} alt={asset?.name} src={content} width="100%" height="100%" />
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

  console.error(`Unhandled media type ${contentType}`);
  return <>Unhandled media type {contentType}</>;
};
