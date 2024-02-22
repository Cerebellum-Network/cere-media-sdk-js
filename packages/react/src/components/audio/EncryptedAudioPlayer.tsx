import { NFT } from '@cere/media-sdk-client';
import { ReactNode } from 'react';

import { useEncryptedContent, useNftMetadata } from '../../hooks';

export interface EncryptedAudioPlayerProps {
  collectionAddress: string;
  nftId: number;
  assetIndex: number;
  loadingComponent?: ReactNode;
  title?: string;
  className?: string;
}

export const EncryptedAudioPlayer = ({
  collectionAddress,
  nftId,
  assetIndex,
  title = 'Cere Audio Player',
  className = '',
  loadingComponent,
}: EncryptedAudioPlayerProps) => {
  const nft = { collection: { address: collectionAddress }, nftId } as NFT;
  const { metadata } = useNftMetadata(collectionAddress, nftId);
  const { content, isLoading } = useEncryptedContent(nft, metadata!, assetIndex);
  const preview = metadata?.assets[assetIndex]?.preview;

  if (isLoading || !content || !metadata) {
    if (loadingComponent) return <>{loadingComponent}</>;
    return <div style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <img src={preview} alt="Audio preview" />
      <audio title={title} controls autoPlay className={className}>
        <source src={content} />
      </audio>
    </div>
  );
};
