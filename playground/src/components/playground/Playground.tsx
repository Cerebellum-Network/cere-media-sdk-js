import { ConnectWallet } from '@thirdweb-dev/react';
import { PlaygroundNavigation } from './PlaygroundNavigation';
import { Box } from '@mui/material';

export const Playground = () => {
  return (
    <>
      <Box sx={{ position: 'fixed', top: '10px', right: '10px' }}>
        <ConnectWallet />
      </Box>
      <Box sx={{ minWidth: '800px', minH: '80vh' }}>
        <PlaygroundNavigation />
      </Box>
    </>
  );
};
