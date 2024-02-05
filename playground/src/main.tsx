import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { ThirdwebProvider, en, localWallet, metamaskWallet, walletConnect } from '@thirdweb-dev/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/home/App.tsx';
import { theme } from './components/theme/theme.ts';
import './index.css';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { VideoExample } from './pages/video-example/VideoExample.tsx';
import { Navigation } from './components/navigation/Navigation.tsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<App />} />
      <Route path="/video-example" element={<VideoExample />} />
    </Route>,
  ),
);

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
        <Navigation />
        <Box sx={{ pt: '80px' }}>
          <RouterProvider router={router} />
        </Box>
      </ThirdwebProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
