import { NFT, NftMetadata } from '@cere-media-sdk/client';
import { useMemo } from 'react';

import { HlsEncryptionLoader, VideoPlayer } from '..';
import { useEncryptedContent, useMediaClient } from '../../hooks';

export interface ContentViewProps {
  nft: NFT;
  metadata: NftMetadata;
  assetIndex: number;
}

export const ContentView = ({ nft, metadata, assetIndex }: ContentViewProps) => {
  const { client, isLoading: isLoadingClient } = useMediaClient();
  const { content, isLoading, isVideo, contentType, asset } = useEncryptedContent(nft, metadata, assetIndex);

  const loader = useMemo(
    () =>
      isVideo && !!client
        ? HlsEncryptionLoader.create({
            collectionAddress: nft.collection.address,
            nftId: nft.nftId,
            assetId: `asset-${assetIndex}`,
            client,
          })
        : undefined,
    [nft, assetIndex, isVideo],
  );

  if (isLoading || isLoadingClient) {
    return <>Loading...</>;
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
