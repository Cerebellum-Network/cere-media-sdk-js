import { CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { theme } from './components/theme';

import './index.css';
import './components/css/plyr.css';
import './components/css/styles.css';
import { WalletProvider } from './cere-wallet';
import { Buffer } from 'buffer';

window.Buffer = Buffer;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <WalletProvider>
        <App />
      </WalletProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
