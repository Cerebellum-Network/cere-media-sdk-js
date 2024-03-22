import { CssBaseline, ThemeProvider } from '@mui/material';
import { ThirdwebProvider, en, localWallet, metamaskWallet, walletConnect } from '@thirdweb-dev/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { theme } from './components/theme';

import './index.css';
import './components/css/plyr.css';
import './components/css/styles.css';
import { cereWallet } from './cere-wallet';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ThirdwebProvider
        activeChain="mumbai"
        autoSwitch
        autoConnect
        locale={en()}
        supportedWallets={[metamaskWallet(), walletConnect(), localWallet(), cereWallet()]}
      >
        <App />
      </ThirdwebProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
