import cereLogo from '/cere.png';
import './App.css';
import { Playground } from './components';
import { Button } from '@mui/material';
import { useWallet, useWalletStatus } from './cere-wallet';
import { useCallback, useEffect } from 'react';

const App = () => {
  const wallet = useWallet();
  const status = useWalletStatus();

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

  if (status === 'connected') {
    return <Playground disconnect={handleDisconnect} />;
  }

  return (
    <>
      <div style={{ justifyContent: 'center' }}>
        <img src={cereLogo} className="logo" alt="Cere logo" />
        <h2>Cere Media SDK Playground</h2>
        <p>Connect Wallet to Get Started</p>
        <Button
          disabled={status === 'not-ready' || status === 'connecting' || status === 'initializing'}
          onClick={handleConnect}
        >
          Connect Cere Wallet
        </Button>
      </div>
    </>
  );
};

export default App;
