import './plyr.css';

import clsx from 'clsx';
import type { Level } from 'hls.js';
import { VideoHTMLAttributes, useEffect, useMemo, useRef, useState } from 'react';

interface VideoPlayerProps {
  src: string;
  hlsEnabled?: boolean;
  loader?: any; // Adjusted to accommodate dynamic import
  className?: string;
  loadingComponent?: React.ReactNode;
  type?: string;
  videoOverrides?: VideoHTMLAttributes<HTMLVideoElement>;
  onFullScreenChange?: (isFullScreen: boolean) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onSeek?: (currentTime: number) => void;
  onEnd?: () => void;
  onError?: () => void;
  onStalled?: () => void;
  onSuspend?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

export const VideoPlayer = ({
  src,
  hlsEnabled = true,
  loader,
  className,
  loadingComponent,
  type,
  onFullScreenChange,
  onPlay,
  onPause,
  onSeek,
  onEnd,
  onError,
  onStalled,
  onSuspend,
  onTimeUpdate,
  videoOverrides = { crossOrigin: 'anonymous' },
}: VideoPlayerProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hlsInstance, setHlsInstance] = useState<any>(null);
  const [Plyr, setPlyr] = useState<any>(null);

  const isVideoSupported = useMemo(() => (hlsEnabled ? hlsInstance?.isSupported() : true), [hlsEnabled, hlsInstance]);

  useEffect(() => {
    const loadDependencies = async () => {
      if (hlsEnabled) {
        const { default: Hls } = await import('hls.js');
        setHlsInstance(() => Hls); // Ensure Hls is correctly set as a constructor function
      }
      const { default: PlyrModule } = await import('plyr');
      setPlyr(() => PlyrModule);
    };

    loadDependencies();
  }, [hlsEnabled]);

  useEffect(() => {
    if (!isVideoSupported || !Plyr) return;

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

        player.on('play', () => onPlay && onPlay());
        player.on('pause', () => onPause && onPause());
        player.on('seeked', () => onSeek && onSeek(player.currentTime));
        player.on('timeupdate', () => onTimeUpdate && onTimeUpdate(player.currentTime, player.duration));
        player.on('ended', () => onEnd && onEnd());
        player.on('canplaythrough', () => {
          setIsLoading(false);
        });
        player.on('enterfullscreen', () => onFullScreenChange?.(true));
        player.on('exitfullscreen', () => onFullScreenChange?.(false));

        player.on('error', () => onError && onError());
        player.on('stalled', () => onStalled && onStalled());
        player.on('suspend', () => onSuspend && onSuspend());

        player.on('enterfullscreen', onFullScreenChange?.(true));
        player.on('exitfullscreen', onFullScreenChange?.(false));
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

      player.on('play', () => onPlay && onPlay());
      player.on('pause', () => onPause && onPause());
      player.on('seeked', () => onSeek && onSeek(player.currentTime));
      player.on('ended', () => onEnd && onEnd());
      player.on('canplaythrough', () => {
        setIsLoading(false);
      });
      player.on('timeupdate', () => onTimeUpdate && onTimeUpdate(player.currentTime, player.duration));
      player.on('enterfullscreen', () => onFullScreenChange?.(true));
      player.on('exitfullscreen', () => onFullScreenChange?.(false));

      player.on('error', () => onError && onError());
      player.on('stalled', () => onStalled && onStalled());
      player.on('suspend', () => onSuspend && onSuspend());

      video.addEventListener('error', () => setIsLoading(false));
      video.addEventListener('stalled', () => setIsLoading(false));
      video.addEventListener('suspend', () => setIsLoading(false));
      video.addEventListener('enterfullscreen', () => onFullScreenChange?.(true));
      video.addEventListener('exitfullscreen', () => onFullScreenChange?.(false));
    };

    if (hlsEnabled && hlsInstance) {
      initializeHls();
    } else {
      initializeVideo();
    }

    return () => {
      if (hlsEnabled && hlsInstance && typeof hlsInstance.destroy === 'function') {
        hlsInstance.destroy();
      }
      if (playerRef.current) {
        playerRef.current.remove();
      }
      playerRef.current = null;
    };
  }, [hlsInstance, hlsEnabled, isVideoSupported, loader, src, wrapperRef, videoOverrides, Plyr]);

  if (!isVideoSupported) {
    return (
      <div className="cere-video-wrapper flex items-center">
        <p className="w-full text-center">Your browser does not support playback of this type.</p>
      </div>
    );
  }

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

  return null;
};
