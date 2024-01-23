import { MediaSdkClientProvider } from '@cere-media-sdk/react';
import { Box } from '@mui/material';
import { ConnectWallet, useSigner } from '@thirdweb-dev/react';
import { PlaygroundNavigation } from './PlaygroundNavigation';

export const Playground = () => {
  const signer = useSigner();

  return (
    <MediaSdkClientProvider signer={signer} options={{ deployment: 'development', tenant: 'davinci' }}>
      <Box sx={{ position: 'fixed', top: '10px', right: '10px' }}>
        <ConnectWallet />
      </Box>
      <Box sx={{ minWidth: '800px', minH: '80vh' }}>
        <PlaygroundNavigation />
      </Box>
    </MediaSdkClientProvider>
  );
};
