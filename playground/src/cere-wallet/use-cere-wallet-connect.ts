import { useConnect } from '@thirdweb-dev/react';
import { useEffect, useMemo } from 'react';
import { cereWallet } from '.';

type PublicKey = string | null;

export const useCereWalletConnect = () => {
  const connect = useConnect();

  const publicKey: PublicKey = useMemo(() => {
    return localStorage.getItem('current-user-public-key');
  }, []);

  useEffect(() => {
    if (!publicKey) return;
    connect(cereWallet('dev'));
  }, [publicKey, connect]);

  return { publicKey };
};
