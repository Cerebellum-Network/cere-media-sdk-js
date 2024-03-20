import { useMemo } from 'react';
import { Grid, Typography } from '@mui/material';
import { EncryptedVideoPlayer, useServerSideUrl } from '@cere/media-sdk-react';
import Hls from 'hls.js';

export const ErrorReproduce = () => {
  const isIosHlsSupported = useMemo(
    () => document.createElement('video').canPlayType('application/vnd.apple.mpegurl') !== '',
    [],
  );

  const isVideoSupported = useMemo(() => Hls.isSupported(), []);

  const collectionAddress = '0x1efa4b344817d5416f9ccd6df0ab6eb5031c2570';
  const nftId = 1;
  const assetIndex = 0;
  const src = 'https://cdn.testnet.cere.network/45/baebb4ihr7v7p22ltk3dhumgu5zxv4bowsrq4pvl3orpjkduohb3odi4puu';
  const { url } = useServerSideUrl({ src, collectionAddress, nftId });

  console.log('isVideoSupported', isVideoSupported);
  console.log('URL', url);
  return (
    <div>
      <div>isIosHlsSupported: {isIosHlsSupported ? 'true' : 'false'}</div>
      <div>isVideoSupported: {isVideoSupported ? 'true' : 'false'}</div>
      <Grid container spacing={2} sx={{ marginTop: '20px' }}>
        <Grid xs={6}>
          <Typography variant="h5" width="auto">
            Server Side
          </Typography>
          <div>TEST</div>
          <EncryptedVideoPlayer
            serverSide
            src={src}
            collectionAddress={collectionAddress}
            nftId={nftId}
            assetIndex={assetIndex}
          />
        </Grid>
      </Grid>
    </div>
  );
};
