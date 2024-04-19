import { useConnect } from '@thirdweb-dev/react';
import { useEffect, useMemo } from 'react';
import { cereWallet } from '.';

type SessionId = string | undefined;

// http://localhost:5173/#sessionId=77af45ce785cd7c8d030c3f7f2922a6a4cebb9b2604178af808545a340431165
export const useCereWalletConnect = () => {
  const connect = useConnect();

  const sessionId: SessionId = useMemo(() => {
    const hash = window.location.hash;
    return hash?.split('=')[1];
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    void connect(cereWallet(sessionId));
  }, [sessionId, connect]);

  return { sessionId };
};
