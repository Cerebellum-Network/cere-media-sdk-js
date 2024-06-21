import { Box, Button } from '@mui/material';
import { PlaygroundNavigation } from './PlaygroundNavigation';
import { SelectTenant } from '../select-tenant';
import { useState } from 'react';
import { CheckNft } from './CheckNft.tsx';

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
      <Box sx={{ minWidth: '800px', minH: '80vh' }}>
        <CheckNft />
      </Box>
    </>
  );
};
