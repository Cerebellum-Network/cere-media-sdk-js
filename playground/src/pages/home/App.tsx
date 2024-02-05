import cereLogo from '/cere.png';
import './App.css';
import { ConnectWallet, useSigner } from '@thirdweb-dev/react';
import { Playground } from '../../components';

const App = () => {
  const signer = useSigner();

  if (signer) {
    return <Playground />;
  }

  return (
    <>
      <div style={{ justifyContent: 'center' }}>
        <img src={cereLogo} className="logo" alt="Cere logo" />
        <h2>Cere Media SDK Playground</h2>
        <p>Connect Wallet to Get Started</p>
        <ConnectWallet />
      </div>
    </>
  );
};

export default App;
