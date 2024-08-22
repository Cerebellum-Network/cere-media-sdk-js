import React, { useState, useEffect, useCallback } from 'react';
import cereLogo from '/cere.png';
import './App.css';
import { Playground } from './components';
import { Box, Button } from '@mui/material';
import { useWallet, useWalletStatus } from './cere-wallet';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';

type MetaMaskEthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
  [key: string]: unknown;
};

const App = () => {
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const wallet = useWallet();
  const status = useWalletStatus();

  const [metaMaskProvider, setMetaMaskProvider] = useState<MetaMaskEthereumProvider | null>(null);
  const [metaMaskAccount, setMetaMaskAccount] = useState<string | null>(null);

  useEffect(() => {
    const initializeMetaMask = async () => {
      const provider = (await detectEthereumProvider()) as MetaMaskEthereumProvider | null;
      if (provider) {
        setMetaMaskProvider(provider);

        const ethersProvider = new ethers.providers.Web3Provider(provider);
        const signer = ethersProvider.getSigner();
        setSigner(signer);

        provider.on('accountsChanged', (accounts) => {
          setMetaMaskAccount((accounts as string[])[0] || null);
        });

        provider.on('chainChanged', () => {
          window.location.reload();
        });
      } else {
        console.error('MetaMask not found');
      }
    };

    initializeMetaMask();
  }, []);

  const connectMetaMask = useCallback(async () => {
    if (metaMaskProvider) {
      try {
        const accounts = await metaMaskProvider.request({ method: 'eth_requestAccounts' });
        setMetaMaskAccount((accounts as string[])?.[0]);
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
    }
  }, [metaMaskProvider]);

  const disconnectMetaMask = useCallback(() => {
    setMetaMaskAccount(null);
  }, []);

  useEffect(() => {
    wallet.isReady.then((readyWallet) => {
      console.log('Ready wallet (isReady)', readyWallet);
    });

    wallet.subscribe('status-update', (status, prevStatus) => {
      console.log('Status update', { status, prevStatus });
    });

    window.addEventListener('focus', () => {
      console.log('Host window received focus');
    });

    window.addEventListener('blur', () => {
      console.log('Host window lost focus');
    });

    wallet.init({
      connectOptions: {
        permissions: {
          personal_sign: {},
          ed25519_signRaw: {},
          solana_signMessage: {},
        },
      },
      context: {
        app: {
          appId: 'cere-media-sdk-playground',
          name: 'Cere Media SDK Playground',
          logoUrl: '/cere.png',
        },
      },
      network: {
        host: 'https://polygon-amoy.infura.io/v3/cba6e957aca549d9bf19c938a3d2548a',
        chainId: 80002,
      },
      env: 'dev',
    });
  }, [wallet]);

  const handleDisconnect = useCallback(() => {
    wallet.disconnect();
  }, [wallet]);

  const handleConnect = useCallback(async () => {
    await wallet.connect();
  }, [wallet]);

  const isAnyWalletConnected = status === 'connected' || metaMaskAccount !== null;

  if (isAnyWalletConnected) {
    return (
      <Playground
        metaMaskAccount={metaMaskAccount ?? undefined}
        metamaskSigner={signer}
        disconnect={status === 'connected' ? handleDisconnect : disconnectMetaMask}
      />
    );
  }

  return (
    <>
      <div style={{ justifyContent: 'center' }}>
        <img src={cereLogo} className="logo" alt="Cere logo" />
        <h2>Cere Media SDK Playground</h2>
        <p>Connect Wallet to Get Started</p>
        <Box display="flex" flexDirection="column">
          <Button
            disabled={
              isAnyWalletConnected || status === 'not-ready' || status === 'connecting' || status === 'initializing'
            }
            startIcon={<img width="20px" src="/cere.png" alt="cere" />}
            onClick={handleConnect}
          >
            Connect Cere Wallet
          </Button>
          <Button
            disabled={isAnyWalletConnected || !metaMaskProvider}
            startIcon={<img width="20px" src="/metamask.png" alt="cere" />}
            onClick={connectMetaMask}
          >
            Connect MetaMask
          </Button>
        </Box>
      </div>
    </>
  );
};

export default App;
