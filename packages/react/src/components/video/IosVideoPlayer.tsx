import './plyr.css';
import './styles.css';

import clsx from 'clsx';
import Hls, { HlsConfig } from 'hls.js';
import Plyr from 'plyr';
import React, { useRef, useState, useEffect, useMemo } from 'react';

interface VideoPlayerProps {
  src: string;
  hlsEnabled?: boolean;
  loader?: HlsConfig['loader'];
  className?: string;
  loadingComponent?: React.ReactNode;
  type?: string;
  videoOverrides?: React.VideoHTMLAttributes<HTMLVideoElement>;
}

export const IosVideoPlayer = ({
  src,
  hlsEnabled = true,
  loader = Hls.DefaultConfig.loader,
  type = 'video/mp4',
  videoOverrides = { crossOrigin: 'anonymous' },
  className,
  loadingComponent,
}: VideoPlayerProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLVideoElement | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);

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
    const plyrOptions: Plyr.Options = {
      autoplay: videoOverrides.autoPlay,
    };

    if (isVideoSupported) {
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
        Object.assign(video, videoOverrides);
        playerRef.current = video;
        videoWrapper.appendChild(video);
        hls.attachMedia(video);
        const player = new Plyr(video, plyrOptions);
        player.on('canplaythrough', () => setIsLoading(false));
      });

      hls.on(Hls.Events.FRAG_LOADED, () => setIsLoading(false));
      hls.loadSource(src);
    } else {
      const video = document.createElement('video');
      video.className = 'cere-video';
      Object.assign(video, videoOverrides);
      video.src = src;
      video.controls = true;
      videoWrapper.appendChild(video);
      video.addEventListener('loadeddata', () => setIsLoading(false));
    }

    return () => {
      hls.destroy();
      if (playerRef.current) {
        playerRef.current.remove();
      }
      playerRef.current = null;
    };
  }, [isVideoSupported, loader, src, videoOverrides]);

  if (isVideoSupported) {
    return (
      <div>
        <div className={clsx('cere-video-wrapper', className)} ref={wrapperRef} />

        {isLoading && (
          <div className="loading-container">
            {loadingComponent ? loadingComponent : <div className="loading-container">Loading video...</div>}
          </div>
        )}
      </div>
    );
  }

  return (
    <video controls {...videoOverrides}>
      <source src={src} type={hlsEnabled ? 'application/vnd.apple.mpegurl' : type} />
    </video>
  );
};
