import cereLogo from '/cere.png';
import './App.css';
import { Playground } from './components';
import { Button } from '@mui/material';
import { useWallet } from './cere-wallet/wallet-context.tsx';
const App = () => {
  const { walletStatus, cereWallet, isReady, handleOnDisconnect } = useWallet();

  if (walletStatus === 'connected' && isReady) {
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
