import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThirdwebProvider, en, localWallet, metamaskWallet, walletConnect } from '@thirdweb-dev/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './components/theme/theme.ts';
import { MediaSdkClientProvider } from '@cere-media-sdk/react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ThirdwebProvider
        activeChain="mumbai"
        autoSwitch
        locale={en()}
        supportedWallets={[metamaskWallet(), walletConnect(), localWallet()]}
      >
        <App />
      </ThirdwebProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
