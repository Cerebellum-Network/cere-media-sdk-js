import './plyr.css';
import './styles.css';

import clsx from 'clsx';
import Hls, { HlsConfig } from 'hls.js';
import Plyr from 'plyr';
import { useEffect, useMemo, useRef, useState } from 'react';

interface VideoPlayerProps {
  src: string;
  hlsEnabled?: boolean;
  loader?: HlsConfig['loader'];
  className?: string;
  loadingComponent?: React.ReactNode;
}

const plyrOptions: Plyr.Options = {
  autoplay: true,
};

export const VideoPlayer = ({
  src,
  hlsEnabled = true,
  loader = Hls.DefaultConfig.loader,
  className,
  loadingComponent,
}: VideoPlayerProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const iosVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isIosSupported = useMemo(
    () => document.createElement('video').canPlayType('application/vnd.apple.mpegurl'),
    [iosVideoRef],
  );
  const isSupported = useMemo(() => (hlsEnabled ? Hls.isSupported() : true), [hlsEnabled]);

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

    if (hlsEnabled && isSupported) {
      const updateQuality = (newQuality: number) => {
        if (newQuality === 0) {
          hls.currentLevel = -1;
        } else {
          hls.levels.forEach((level, levelIndex) => {
            if (level.height === newQuality) {
              hls.currentLevel = levelIndex;
            }
          });
        }
      };

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const availableQualities = hls.levels.map((l) => l.height);
        plyrOptions.quality = {
          default: -1, // auto
          options: availableQualities,
          forced: true,
          onChange: (quality: number) => updateQuality(quality),
        };
        const video = document.createElement('video');
        video.className = 'cere-video';
        playerRef.current = video;
        videoWrapper.appendChild(video);
        hls.attachMedia(video);
        const player = new Plyr(video, plyrOptions);
        player.on('canplaythrough', () => setIsLoading(false));
      });

      hls.on(Hls.Events.FRAG_LOADED, () => {
        setIsLoading(false);
      });

      hls.loadSource(src);
    } else if (hlsEnabled && isIosSupported) {
      const video = iosVideoRef.current;
      if (!video) return;
      videoWrapper.appendChild(video);
      video.src = src;
      video.addEventListener('canplay', function () {
        setIsLoading(false);
      });
    } else {
      const video = document.createElement('video');
      video.className = 'cere-video';
      playerRef.current = video;
      videoWrapper.appendChild(video);
      video.src = src;
      const player = new Plyr(video, plyrOptions);
      player.on('canplaythrough', () => setIsLoading(false));
      video.addEventListener('error', () => setIsLoading(false));
      video.addEventListener('stalled', () => setIsLoading(false));
      video.addEventListener('suspend', () => setIsLoading(false));
    }

    return () => {
      hls.destroy();
      if (playerRef.current) {
        playerRef.current.remove();
      }
      playerRef.current = null;
    };
  }, [isSupported, loader, src, wrapperRef]);

  if (!isSupported && !isIosSupported) {
    return (
      <div className="cere-video-wrapper flex items-center">
        <p className="w-full text-center">Your browser does not support HLS.</p>
      </div>
    );
  }

  return (
    <div>
      <div className={clsx('cere-video-wrapper', className)} ref={wrapperRef} />
      {isIosSupported && <video ref={iosVideoRef} controls autoPlay disableRemotePlayback />}

      {isLoading && (
        <div className="loading-container">
          {loadingComponent ? loadingComponent : <div className="loading-container">Loading video...</div>}
        </div>
      )}
    </div>
  );
};
