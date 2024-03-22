import { useMemo } from 'react';

export const useIsIOSWithHlsSupport = () => {
  return useMemo(() => {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }, []);
};
