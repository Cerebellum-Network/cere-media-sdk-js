import { CssBaseline, ThemeProvider } from '@mui/material';
import { ThirdwebProvider, en, localWallet, metamaskWallet, walletConnect } from '@thirdweb-dev/react';
import { PolygonAmoyTestnet } from '@thirdweb-dev/chains';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { theme } from './components/theme';

import './index.css';
import './components/css/plyr.css';
import './components/css/styles.css';
import { WalletProvider } from './cere-wallet/wallet-context.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ThirdwebProvider
        activeChain={PolygonAmoyTestnet}
        autoSwitch
        autoConnect
        locale={en()}
        supportedWallets={[metamaskWallet(), walletConnect(), localWallet()]}
      >
        <WalletProvider>
          <App />
        </WalletProvider>
      </ThirdwebProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
