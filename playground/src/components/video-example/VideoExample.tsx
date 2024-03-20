/* eslint-disable @typescript-eslint/no-unused-vars */
import { EncryptedVideoPlayer, VideoPlayer, useServerSideUrl } from '@cere/media-sdk-react';
import { Box, CircularProgress } from '@mui/material';

export const VideoExample = () => {
  return <PublicDdcVideo />;
};

const collectionAddress = '0x328ce3f7d4f146aecd89b3bd0b6831e939192ebd';
const nftId = 1;
const assetIndex = 0;
const src = 'https://cdn.testnet.cere.network/43/baebb4ihmch2ntqofidyasnbux7i6ls6gaihqy2il5xeqgq5ebrdglxurr4'; // davinci dev asset URL
const cmsVideo = 'https://assets-cms-freeport.network.aws.cere.io/pexels_videos_2022395_1080p_d2a3c6053b.mp4';
const publicDdcVideo =
  'https://cdn.testnet.cere.network/157/baebb4igap7odoisdnrrq4oqndu3e7uvtottjgbax7qi2ml6uuovikownba';

/**
 * This is an example of a video from the DDC that is not HLS encoded
 */
const PublicDdcVideo = () => (
  <VideoPlayer
    src={publicDdcVideo}
    hlsEnabled={false}
    loadingComponent={<CircularProgress />}
    videoOverrides={{ autoPlay: true }}
  />
);

const CmsVideo = () => (
  <VideoPlayer src={cmsVideo} hlsEnabled={false} loadingComponent={<CircularProgress />} videoOverrides={{}} />
);

/**
 * This is an example of a video from the DDC that is HLS encoded and encrypted so that only an owner can view it.
 * The decryption is done on the server side.
 */
const EncryptedDdcVideoServerSide = () => {
  const { url } = useServerSideUrl({ src, collectionAddress, nftId });

  if (!url) return <CircularProgress />;

  return <VideoPlayer src={url} hlsEnabled={true} loadingComponent={<CircularProgress />} />;
};

/**
 * This is an example of a video from the DDC that is HLS encoded and encrypted so that only an owner can view it.
 * The decryption is done on the client side.
 */
const EncryptedDdcVideoClientSide = () => (
  <EncryptedVideoPlayer
    src={src}
    collectionAddress={collectionAddress}
    nftId={nftId}
    assetIndex={assetIndex}
    loadingComponent={<CircularProgress />}
  />
);
