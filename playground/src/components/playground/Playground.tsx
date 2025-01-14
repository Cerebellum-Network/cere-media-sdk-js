import { Box, Button } from '@mui/material';
import { SelectTenant } from '../select-tenant';
import { useState } from 'react';
import { ethers } from 'ethers';
import { PlaygroundNavigation } from './PlaygroundNavigation.tsx';

export const Playground = ({
  disconnect,
  metaMaskAccount,
  metamaskSigner,
}: {
  disconnect: () => void;
  metaMaskAccount?: string;
  metamaskSigner: ethers.Signer | null;
}) => {
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
          {metaMaskAccount && <p>Connected to MetaMask: {metaMaskAccount}</p>}
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
            Disconnect Wallet
          </Button>
        </Box>
      )}

      <Box sx={{ minWidth: '800px', minH: '80vh' }}>
        <PlaygroundNavigation metamaskSigner={metamaskSigner} />
      </Box>
    </>
  );
};
