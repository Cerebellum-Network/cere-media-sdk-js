import { MediaSdkClientProvider } from '@cere/media-sdk-react';
import { Box } from '@mui/material';
import { ConnectWallet, useSigner } from '@thirdweb-dev/react';
import { PlaygroundNavigation } from './PlaygroundNavigation';
import { SelectTenant } from '../select-tenant/SelectTenant';
import { useSelectTenant } from '../select-tenant/UseSelectTenant';

export const Playground = () => {
  const signer = useSigner();
  const options = useSelectTenant();

  return (
    <>
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
        }}
      >
        <ConnectWallet />
        <SelectTenant {...options} />
      </Box>
      <MediaSdkClientProvider signer={signer} options={options}>
        <Box sx={{ minWidth: '800px', minH: '80vh' }}>
          <PlaygroundNavigation />
        </Box>
      </MediaSdkClientProvider>
    </>
  );
};
