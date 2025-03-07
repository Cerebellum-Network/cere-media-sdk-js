import './plyr.css';

import clsx from 'clsx';
import type { Level } from 'hls.js';
import React, { useRef, useState, useEffect, useMemo } from 'react';

interface VideoPlayerProps {
  src: string;
  hlsEnabled?: boolean;
  loader?: any; // Adjusted to accommodate dynamic import
  className?: string;
  loadingComponent?: React.ReactNode;
  type?: string;
  videoOverrides?: React.VideoHTMLAttributes<HTMLVideoElement>;
}

export const IosVideoPlayer = ({
  src,
  hlsEnabled = true,
  loader,
  type = 'video/mp4',
  videoOverrides = { crossOrigin: 'anonymous' },
  className,
  loadingComponent,
}: VideoPlayerProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const [hlsInstance, setHlsInstance] = useState<any>(null);
  const [Plyr, setPlyr] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isVideoSupported = useMemo(() => (hlsEnabled ? hlsInstance?.isSupported() : true), [hlsEnabled, hlsInstance]);

  useEffect(() => {
    const loadDependencies = async () => {
      if (hlsEnabled) {
        const { default: Hls } = await import('hls.js');
        setHlsInstance(Hls);
      }
      const { default: PlyrModule } = await import('plyr');
      setPlyr(() => PlyrModule);
    };

    loadDependencies();
  }, [hlsEnabled]);

  useEffect(() => {
    if (playerRef.current || !isVideoSupported || !Plyr) return;

    const videoWrapper = wrapperRef.current;
    if (!videoWrapper) return;

    const plyrOptions: Plyr.Options = {
      autoplay: videoOverrides.autoPlay,
    };

    const initializeHls = () => {
      const hlsOptions: Partial<any> = {
        fragLoadingTimeOut: 30_000,
        manifestLoadingTimeOut: 10_000,
        levelLoadingTimeOut: 15_000,
        loader: loader || hlsInstance.DefaultConfig.loader,
      };

      const hls = new hlsInstance(hlsOptions);

      const updateQuality = (newQuality: number) => {
        if (newQuality === 0) {
          hls.currentLevel = -1;
        } else {
          hls.levels.forEach((level: Level, levelIndex: number) => {
            if (level.height === newQuality) {
              hls.currentLevel = levelIndex;
            }
          });
        }
      };

      hls.on(hlsInstance.Events.MANIFEST_PARSED, () => {
        const availableQualities = hls.levels.map((l: Level) => l.height);
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

      hls.on(hlsInstance.Events.FRAG_LOADED, () => setIsLoading(false));
      hls.loadSource(src);
    };

    const initializeVideo = () => {
      const video = document.createElement('video');
      const source = document.createElement('source');

      if (type) {
        source.type = type;
      }

      source.src = src;
      video.className = 'cere-video';

      video.appendChild(source);
      playerRef.current = video;
      videoWrapper.appendChild(video);

      Object.assign(video, videoOverrides);
      const player = new Plyr(video, plyrOptions);
      player.on('canplaythrough', () => setIsLoading(false));
      video.addEventListener('error', () => setIsLoading(false));
      video.addEventListener('stalled', () => setIsLoading(false));
      video.addEventListener('suspend', () => setIsLoading(false));
    };

    if (hlsEnabled && hlsInstance) {
      initializeHls();
    } else {
      initializeVideo();
    }

    return () => {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
      if (playerRef.current) {
        playerRef.current.remove();
      }
      playerRef.current = null;
    };
  }, [hlsInstance, hlsEnabled, isVideoSupported, loader, src, wrapperRef, videoOverrides, Plyr]);
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
