import { VideoPlayer } from '@cere/media-sdk-react';
import { Box } from '@mui/material';

const src = 'https://assets-cms-freeport.network.aws.cere.io/pexels_videos_2022395_1080p_d2a3c6053b.mp4';

export const VideoExample = () => {
  return (
    <Box sx={{ width: '400px', h: '200px' }}>
      <VideoPlayer src={src} hlsEnabled={false} />
    </Box>
  );
};
