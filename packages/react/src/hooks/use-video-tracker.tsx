import { useEffect, useState, RefObject } from 'react';

type Props = {
  videoRef: RefObject<HTMLVideoElement> | null;
  totalDuration: number;
  threshold?: number;
  onVideoWatched?: () => void;
};

export const useVideoTracker = ({ videoRef = null, totalDuration = 0, threshold = 80, onVideoWatched }: Props) => {
  const [watchedTime, setWatchedTime] = useState(0);
  const [videoWatchedSent, setVideoWatchedSent] = useState(false);

  useEffect(() => {
    const videoElement = videoRef?.current;

    if (!videoElement) {
      return;
    }

    const updateWatchedTime = () => {
      const currentTime = videoElement.currentTime;
      setWatchedTime(currentTime);
      if (currentTime / totalDuration > threshold / 100 && !videoWatchedSent) {
        setVideoWatchedSent(true);
        onVideoWatched?.();
      }
    };

    videoElement.addEventListener('timeupdate', updateWatchedTime);

    return () => {
      videoElement.removeEventListener('timeupdate', updateWatchedTime);
    };
  }, [videoRef?.current, totalDuration, threshold, videoWatchedSent]);

  return { watchedTime, totalDuration };
};
