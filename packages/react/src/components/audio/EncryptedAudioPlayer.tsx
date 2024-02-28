import 'react-h5-audio-player/lib/styles.css';
import './styles.css';

import { NFT } from '@cere/media-sdk-client';
import { ReactNode } from 'react';
import AudioPlayer from 'react-h5-audio-player';

import { useEncryptedContent, useNftMetadata } from '../../hooks';

import { EncryptedAudioPlayerOptions } from './types';

export interface EncryptedAudioPlayerProps {
  collectionAddress: string;
  nftId: number;
  assetIndex: number;
  loadingComponent?: ReactNode;
  title?: string;
  className?: string;
  playerOverrides?: EncryptedAudioPlayerOptions;
}

export const EncryptedAudioPlayer = ({
  collectionAddress,
  nftId,
  assetIndex,
  loadingComponent,
  playerOverrides,
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
      <img src={preview} alt="Audio preview" style={{ width: '100%' }} />
      <AudioPlayer
        src={content}
        customAdditionalControls={[]}
        style={{ boxShadow: 'none', marginTop: '-88px' }}
        {...playerOverrides}
      />
    </div>
  );
};
