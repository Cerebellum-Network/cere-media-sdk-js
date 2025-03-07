import { NFT, NftMetadata } from '@cere/media-sdk-client';
import { useEffect, useState } from 'react';

import { createHlsEncryptionLoader, VideoPlayer } from '..';
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

export const NftContentView = ({ nft, metadata, assetIndex }: ContentViewProps) => {
  const { client, isLoading: isLoadingClient } = useMediaClient();
  const { content, isLoading, isVideo, contentType, asset } = useEncryptedContent(nft, metadata, assetIndex);
  const [loader, setLoader] = useState<any>(null);
  const assetCid = asset.asset.split('/').pop();

  useEffect(() => {
    const initializeLoader = async () => {
      if (isVideo && !!client) {
        const loaderInstance = await createHlsEncryptionLoader({
          collectionAddress: nft.collection.address,
          nftId: nft.nftId,
          assetId: `asset-${assetCid}`,
          client,
        });
        setLoader(() => loaderInstance); // Set the loader instance once it's ready
      }
    };

    initializeLoader();
  }, [nft, assetCid, isVideo, client]);

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
    return <VideoPlayer src={asset.asset} loader={loader} hlsEnabled={true} />;
  }

  console.error(`Unhandled media type ${contentType}`);
  return <>Unhandled media type {contentType}</>;
};
