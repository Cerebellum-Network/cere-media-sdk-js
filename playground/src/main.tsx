import { CssBaseline, ThemeProvider } from '@mui/material';
import { ThirdwebProvider, en, localWallet, metamaskWallet, walletConnect } from '@thirdweb-dev/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { theme } from './components/theme/theme.ts';
import './index.css';
import { cereWallet } from './cere-wallet/CereWalletConfig.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ThirdwebProvider
        activeChain="mumbai"
        autoSwitch
        locale={en()}
        supportedWallets={[metamaskWallet(), walletConnect(), localWallet(), cereWallet()]}
      >
        <App />
      </ThirdwebProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
