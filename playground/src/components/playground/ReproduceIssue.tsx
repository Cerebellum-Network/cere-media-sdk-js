import { useAddress } from '@thirdweb-dev/react';
import {
  EncryptedAudioPlayer,
  useNftMetadata,
  useOwnedNfts,
  useIsIOSWithHlsSupport,
  EncryptedVideoPlayer,
} from '@cere/media-sdk-react';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import { NFT } from '@cere/media-sdk-client';
import React, { useMemo } from 'react';
import Hls from 'hls.js';

export const ReproduceIssue = () => {
  const address = useAddress();
  const isIOSWithHlsSupport = useIsIOSWithHlsSupport();
  const isVideoSupported = useMemo(() => Hls.isSupported(), []);
  const isIphone = () => {
    return /iPhone/i.test(navigator.userAgent);
  };
  const { ownedNfts, isLoading } = useOwnedNfts(address);

  return (
    <Box minWidth="328px" maxWidth="328px" width="100%">
      <Box>isIOSWithHlsSupport: {isIOSWithHlsSupport ? 'true' : 'false'}</Box>
      <div>isVideoSupported: {isVideoSupported ? 'true' : 'false'}</div>
      <div>isIphone: {isIphone() ? 'true' : 'false'}</div>
      {isLoading ? (
        <CircularProgress />
      ) : (
        ownedNfts.map((nft, idx) => <NFTAsset nft={nft} key={`${nft.nftId}_${nft.collection.address}`} index={idx} />)
      )}
    </Box>
  );
};

const NFTAsset = ({ nft, index }: { nft: NFT; index: number }) => {
  const { metadata, isLoading } = useNftMetadata(nft.collection.address, nft.nftId);
  const isIOSWithHlsSupport = useIsIOSWithHlsSupport();

  const renderContent = useMemo(() => {
    if (!metadata) return null;

    const asset = metadata.assets[0];
    const contentType = asset.contentType;

    const isStreamableVideo = !!contentType && contentType.includes('video');
    const isStreamableAudio = !!contentType && contentType.includes('audio');

    if (!isStreamableVideo && !isStreamableAudio) {
      return (
        <div>
          {!asset || isLoading ? (
            <CircularProgress size="30px" />
          ) : (
            <img style={{ maxHeight: '416px' }} src={asset.preview} alt="Exhibit" />
          )}
        </div>
      );
    }

    if (isStreamableAudio) {
      return (
        <EncryptedAudioPlayer
          collectionAddress={nft.collection.address}
          nftId={Number(nft.nftId)}
          assetIndex={0}
          loadingComponent={<CircularProgress size="30px" />}
        />
      );
    }

    return (
      <EncryptedVideoPlayer
        serverSide={isIOSWithHlsSupport}
        src={asset.asset}
        collectionAddress={nft.collection.address}
        nftId={nft.nftId}
        assetIndex={index}
      />
    );
  }, [metadata, isIOSWithHlsSupport, nft.collection.address, nft.nftId, index, isLoading]);

  return (
    <Box position="relative">
      <Box display="flex" alignSelf="stretch">
        {isLoading ? <CircularProgress /> : renderContent}
      </Box>
    </Box>
  );
};
