import cereLogo from '/cere.png';
import './App.css';
import { Playground } from './components';
import { CereWallet } from './cere-wallet';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { CereWalletConnector } from './cere-wallet/CereWalletConnector.ts';
import { WalletStatus } from '@cere/embed-wallet';
const App = () => {
  const [walletStatus, setWalletStatus] = useState<WalletStatus>();
  const cereWallet = new CereWallet();
  const connector = new CereWalletConnector(cereWallet);

  useEffect(() => {
    void connector.preload();
  }, [connector]);

  useEffect(() => {
    const getWalletStatus = async () => {
      try {
        connector.subscribe('status-update', (status: WalletStatus, prevStatus: WalletStatus) => {
          if (prevStatus === 'connected' && status === 'ready') {
            window.location.reload();
          }
          setWalletStatus(status);
        });
      } catch (error) {
        console.error('Failed to preload wallet:', error);
      }
    };
    void getWalletStatus();
  }, [connector]);

  const handleOnDisconnect = () => {
    connector.disconnectWallet().then(() => null);
  };

  if (walletStatus === 'connected') {
    return <Playground disconnect={handleOnDisconnect} />;
  }

  return (
    <>
      <div style={{ justifyContent: 'center' }}>
        <img src={cereLogo} className="logo" alt="Cere logo" />
        <h2>Cere Media SDK Playground</h2>
        <p>Connect Wallet to Get Started</p>
        <Button onClick={() => cereWallet.connect()}>Connect Cere Wallet</Button>
      </div>
    </>
  );
};

export default App;
