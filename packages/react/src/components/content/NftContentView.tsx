import { FreeportNftAsset, NFT } from '@cere/media-sdk-client';

import { useEncryptedContent } from '../../hooks';
import { useNftMetadata } from '../../hooks/use-nfts';
import { EncryptedVideoPlayer } from '../video';

export const NftContentView = ({
  assetIndex,
  asset,
  nftId,
  collectionAddress,
}: {
  assetIndex: number;
  asset: FreeportNftAsset;
  nftId: number;
  collectionAddress: string;
}) => {
  const nft = {
    collection: { address: collectionAddress },
    nftId,
  } as NFT;
  const { metadata } = useNftMetadata(collectionAddress, nftId);

  const { content, isLoading, isVideo, contentType } = useEncryptedContent(nft, metadata!, assetIndex);

  if (isLoading) {
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
    return (
      <EncryptedVideoPlayer
        src={asset.asset}
        collectionAddress={collectionAddress}
        nftId={nftId}
        assetIndex={assetIndex}
      />
    );
  }

  console.error(`Unhandled media type ${contentType}`);
  return <>Unhandled media type {contentType}</>;
};
