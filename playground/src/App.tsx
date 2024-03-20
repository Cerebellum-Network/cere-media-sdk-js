import cereLogo from '/cere.png';
import './App.css';
import { ConnectWallet, useSigner } from '@thirdweb-dev/react';
import { Playground } from './components';
import { useCereWalletConnect } from './cere-wallet/use-cere-wallet-connect.ts';

const App = () => {
  useCereWalletConnect();
  const signer = useSigner();

  console.log(signer);

  if (signer) {
    return <Playground />;
  }

  return (
    <>
      <div style={{ justifyContent: 'center' }}>
        <img src={cereLogo} className="logo" alt="Cere logo" />
        <h2>Cere Media SDK Playground</h2>
        <p>Connect Wallet to Get Started</p>
        <ConnectWallet
          welcomeScreen={{
            title: 'Your Title',
            subtitle: 'Your Subtitle',
            img: {
              src: 'https://...',
              width: 300,
              height: 50,
            },
          }}
        />
      </div>
    </>
  );
};

export default App;
