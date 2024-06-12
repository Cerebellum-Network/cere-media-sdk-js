import { EncryptedVideoPlayer, useEncryptedContent } from '@cere/media-sdk-react';
import { FreeportNftAsset } from './types.ts';
import { ChainNamespace } from '@cere/media-sdk-client';

export const NftContentView = ({
  assetIndex,
  asset,
  nftId,
  collectionAddress,
  chainId,
  chainNamespace,
}: {
  assetIndex: number;
  asset: FreeportNftAsset;
  nftId: number;
  collectionAddress: string;
  chainId: string;
  chainNamespace: ChainNamespace;
}) => {
  const { content, isLoading, isVideo, contentType } = useEncryptedContent(
    nftId,
    collectionAddress,
    asset,
    chainId,
    chainNamespace,
  );

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
