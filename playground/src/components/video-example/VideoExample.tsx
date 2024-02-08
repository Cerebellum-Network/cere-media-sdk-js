/* eslint-disable @typescript-eslint/no-unused-vars */
import { EncryptedVideoPlayer, VideoPlayer, useServerSideUrl } from '@cere/media-sdk-react';
import { Box, Typography } from '@mui/material';

const src = 'https://cdn.testnet.cere.network/45/baebb4igwtqr7suw5qma2miqcminqtja5augjchg5wrhtet76k6yu7fjrji'; // davinci dev full
const normalVideoSrc = 'https://assets-cms-freeport.network.aws.cere.io/pexels_videos_2022395_1080p_d2a3c6053b.mp4';

export const VideoExample = () => {
  const { url } = useServerSideUrl({
    src,
    collectionAddress: '0x0b785F2a098851646aa128aE4c1e2CE5B4Ee96bB',
    nftId: 2,
  });

  if (!url) return <Typography>loading</Typography>;

  return (
    <Box>
      {/* <EncryptedVideoPlayer
        src={url}
        collectionAddress="0x0b785F2a098851646aa128aE4c1e2CE5B4Ee96bB"
        nftId={2}
        assetIndex={1}
      /> */}
      <VideoPlayer src={normalVideoSrc} hlsEnabled={false} />
    </Box>
  );
};
