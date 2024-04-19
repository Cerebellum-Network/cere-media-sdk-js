import { NFT, NftMetadata } from '@cere/media-sdk-client';
import { useMemo } from 'react';

import { HlsEncryptionLoader, VideoPlayer } from '..';
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
}

export const ContentView = ({ nft, metadata, assetIndex }: ContentViewProps) => {
  const { client, isLoading: isLoadingClient } = useMediaClient();
  const { content, isLoading, isVideo, contentType, asset } = useEncryptedContent(nft, metadata, assetIndex);
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
    return <div style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>Loading...</div>;
  }

  if (['image/png', 'image/jpeg', 'image/gif'].includes(contentType)) {
    return <>{content && <img alt={asset?.name} src={content} width="100%" height="100%" />}</>;
  }

  if (['audio/mp4', 'audio/mpeg', 'audio/x-wav', 'audio/ogg'].includes(contentType)) {
    return (
      <audio title={asset?.name} controls autoPlay>
        <source src={content} />
      </audio>
    );
  }

  if (isVideo) {
    return <VideoPlayer src={asset.asset} loader={loader} />;
  }

  console.error(`Unhandled media type ${contentType}`);
  return <>Unhandled media type {contentType}</>;
};
