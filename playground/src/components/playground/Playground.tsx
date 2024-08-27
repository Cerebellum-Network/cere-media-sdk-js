import { Box, Button, CircularProgress } from '@mui/material';
import { SelectTenant } from '../select-tenant';
import { useState } from 'react';
import { CheckNft } from './CheckNft.tsx';
import { VideoPlayer } from '@cere/media-sdk-react';

export const Playground = ({ disconnect }: { disconnect: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <>
      {isOpen ? (
        <Box
          sx={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            borderRadius: '10px',
            bgcolor: '#eefbff',
            boxShadow: '5px',
            border: '1px solid',
            borderColor: '#25a4ff',
            p: '10px',
            zIndex: 1001,
            flexDirection: 'column',
            display: 'flex',
          }}
        >
          <Button onClick={onClose}>Close</Button>
          <SelectTenant />
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: 1001,
          }}
        >
          <Button
            sx={{
              borderRadius: '10px',
              bgcolor: '#eefbff',
              boxShadow: '5px',
              border: '1px solid',
              borderColor: '#25a4ff',
              p: '10px',
            }}
            onClick={onOpen}
          >
            Config
          </Button>
          <Button
            sx={{
              borderRadius: '10px',
              bgcolor: '#eefbff',
              boxShadow: '5px',
              border: '1px solid',
              borderColor: '#25a4ff',
              p: '10px',
            }}
            onClick={disconnect}
          >
            Disconnect Cere Wallet
          </Button>
        </Box>
      )}
      <VideoPlayer
        hlsEnabled={false}
        loadingComponent={<CircularProgress />}
        src="https://cdn.dragon.cere.network/2/baebb4iazaryffbwed2pkt66qunrratiuz4o2d6u4c32jwbgrua7waltaje"
        videoOverrides={{
          poster: 'https://cdn.dragon.cere.network/2/baebb4icwzoqa6cpb6wnni5weanzjomzni7voaatpv4ir2u4jtuhuqkgzc4',
        }}
        type="video/mp4"
      />
      <Box sx={{ minWidth: '800px', minH: '80vh' }}>
        <CheckNft />
      </Box>
    </>
  );
};
