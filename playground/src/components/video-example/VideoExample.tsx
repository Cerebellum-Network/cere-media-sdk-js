import { VideoPlayer, useServerSideUrl } from '@cere/media-sdk-react';
import { Box, Typography } from '@mui/material';

const src = 'https://cdn.testnet.cere.network/45/baebb4igwtqr7suw5qma2miqcminqtja5augjchg5wrhtet76k6yu7fjrji'; // davinci dev full

export const VideoExample = () => {
  const { url } = useServerSideUrl({
    src,
    collectionAddress: '0x0b785F2a098851646aa128aE4c1e2CE5B4Ee96bB',
    nftId: 2,
  });

  if (!url) return <Typography>loading</Typography>;

  return <Box>{<VideoPlayer src={url} />}</Box>;
};
