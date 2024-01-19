import { ConnectWallet, useSigner } from '@thirdweb-dev/react';
import { PlaygroundNavigation } from './PlaygroundNavigation';
import { Box } from '@mui/material';
import { useMediaClient } from '@cere-media-sdk/react';

export const Playground = () => {
  const signer = useSigner();

  const client = useMediaClient(signer, { tenant: 'cerefans', deployment: 'development', logger: true });

  console.log({ client });

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
