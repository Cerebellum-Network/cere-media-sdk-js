import './plyr.css';
import './styles.css';

import clsx from 'clsx';
import { HlsConfig, Level } from 'hls.js';
import { VideoHTMLAttributes, useEffect, useMemo, useRef, useState } from 'react';

interface VideoPlayerProps {
  src: string;
  hlsEnabled?: boolean;
  loader?: HlsConfig['loader'];
  className?: string;
  loadingComponent?: React.ReactNode;
  type?: string;
  videoOverrides?: VideoHTMLAttributes<HTMLVideoElement>;
}

export const VideoPlayer = ({
  src,
  hlsEnabled = true,
  loader,
  className,
  loadingComponent,
  type,
  videoOverrides = { crossOrigin: 'anonymous' },
}: VideoPlayerProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [Hls, setHls] = useState<any>(null);
  const [Plyr, setPlyr] = useState<any>(null);

  const isVideoSupported = useMemo(() => (hlsEnabled && Hls ? Hls.isSupported() : true), [hlsEnabled, Hls]);

  useEffect(() => {
    const initializeDependencies = async () => {
      if (hlsEnabled) {
        const { default: HlsModule } = await import('hls.js');
        setHls(HlsModule);
      }
      const { default: PlyrModule } = await import('plyr');
      setPlyr(PlyrModule);
    };

    initializeDependencies();
  }, [hlsEnabled]);

  useEffect(() => {
    if (!Hls || !Plyr || playerRef.current) return;

    const videoWrapper = wrapperRef.current;
    if (!videoWrapper) return;

    const plyrOptions: Plyr.Options = {
      autoplay: videoOverrides.autoPlay,
    };

    if (!isVideoSupported) {
      return;
    }

    if (Hls && hlsEnabled) {
      const hlsOptions: Partial<any> = {
        fragLoadingTimeOut: 30_000,
        manifestLoadingTimeOut: 10_000,
        levelLoadingTimeOut: 15_000,
        loader: loader || Hls.DefaultConfig.loader,
      };

      const hlsInstance = new Hls(hlsOptions);

      const updateQuality = (newQuality: number) => {
        if (newQuality === 0) {
          hlsInstance.currentLevel = -1;
        } else {
          hlsInstance.levels.forEach((level: Level, levelIndex: number) => {
            if (level.height === newQuality) {
              hlsInstance.currentLevel = levelIndex;
            }
          });
        }
      };

      hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
        const availableQualities = hlsInstance.levels.map((l: Level) => l.height);
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
        hlsInstance.attachMedia(video);
        const player = new Plyr(video, plyrOptions);
        player.on('canplaythrough', () => setIsLoading(false));
      });

      hlsInstance.on(Hls.Events.FRAG_LOADED, () => setIsLoading(false));
      hlsInstance.loadSource(src);

      return () => {
        hlsInstance.destroy();
        if (playerRef.current) {
          playerRef.current.remove();
        }
        playerRef.current = null;
      };
    } else {
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
    }
  }, [isVideoSupported, loader, src, wrapperRef, Hls]);

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
