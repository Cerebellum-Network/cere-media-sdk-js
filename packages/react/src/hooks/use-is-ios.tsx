import { useMemo } from 'react';

export const useIsIOSWithHlsSupport = () => {
  return useMemo(() => {
    const videoElement = document.createElement('video');
    return videoElement.canPlayType('application/vnd.apple.mpegurl') !== '';
  }, []);
};
