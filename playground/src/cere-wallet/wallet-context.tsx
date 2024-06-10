import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { CereWallet } from './CereWallet.ts';
import { CereWalletConnector } from './CereWalletConnector.ts';
import { WalletStatus } from '@cere/embed-wallet';

interface WalletContextProps {
  walletStatus: WalletStatus | undefined;
  isReady: boolean;
  cereWallet: CereWallet;
  connector: CereWalletConnector;
  handleOnDisconnect: () => Promise<void>;
}

const defaultValue: WalletContextProps = {
  walletStatus: undefined,
  isReady: false,
  cereWallet: new CereWallet(),
  connector: new CereWalletConnector(new CereWallet()),
  handleOnDisconnect: async () => {},
};
const WalletContext = createContext<WalletContextProps>(defaultValue);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [walletStatus, setWalletStatus] = useState<WalletStatus>();
  const [isReady, setIsReady] = useState<boolean>(false);
  const cereWallet = new CereWallet();
  const connector = new CereWalletConnector(cereWallet);

  useEffect(() => {
    const preloadConnector = async () => {
      try {
        await connector.preload();
      } catch (error) {
        console.error('Failed to preload wallet:', error);
      }
    };
    preloadConnector();
  }, [connector]);

  useEffect(() => {
    const wait = async () => {
      const isReady = await cereWallet.isReady();
      if (isReady) {
        setIsReady(true);
      }
    };
    wait();
  }, [cereWallet]);

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
        console.error('Failed to get wallet status:', error);
      }
    };
    getWalletStatus();
  }, [connector]);

  const handleOnDisconnect = async () => {
    try {
      await connector.disconnectWallet();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  return (
    <WalletContext.Provider value={{ walletStatus, cereWallet, isReady, connector, handleOnDisconnect }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  return useContext(WalletContext);
};
