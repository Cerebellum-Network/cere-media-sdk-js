import './plyr.css';
import './styles.css';

import Hls, { HlsConfig } from 'hls.js';
import { VideoHTMLAttributes, useEffect, useMemo, useRef } from 'react';

interface VideoPlayerProps {
  src: string;
  hlsEnabled?: boolean;
  loader?: HlsConfig['loader'];
  className?: string;
  loadingComponent?: React.ReactNode;
  type?: string;
  videoOverrides?: VideoHTMLAttributes<HTMLVideoElement>;
}

export const IosVideoPlayer = ({
  src,
  hlsEnabled = true,
  loader = Hls.DefaultConfig.loader,
  type = 'video/mp4',
  videoOverrides = { crossOrigin: 'anonymous' },
}: VideoPlayerProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const iosVideoRef = useRef<HTMLVideoElement | null>(null);

  const isVideoSupported = useMemo(() => (hlsEnabled ? Hls.isSupported() : true), [hlsEnabled]);

  useEffect(() => {
    if (playerRef.current) return;

    const videoWrapper = wrapperRef.current;
    if (!videoWrapper) return;

    const hlsOptions: Partial<HlsConfig> = {
      fragLoadingTimeOut: 30_000,
      manifestLoadingTimeOut: 10_000,
      levelLoadingTimeOut: 15_000,
      loader,
    };

    const hls = new Hls(hlsOptions);

    if (!isVideoSupported) {
      return;
    }

    const video = iosVideoRef.current;
    if (!video) return;
    videoWrapper.appendChild(video);
    video.src = src;
    Object.assign(video, videoOverrides);

    return () => {
      hls.destroy();
      if (playerRef.current) {
        playerRef.current.remove();
      }
      playerRef.current = null;
    };
  }, [isVideoSupported, loader, src, wrapperRef]);

  return (
    <>
      <video controls {...videoOverrides}>
        <source src={src} type={hlsEnabled ? 'application/vnd.apple.mpegurl' : type} />
      </video>
    </>
  );
};
