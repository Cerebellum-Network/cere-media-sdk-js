import clsx from 'clsx';
import Hls, { HlsConfig } from 'hls.js';
import Plyr from 'plyr';
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

export const CustomVideoPlayer = ({
  src,
  hlsEnabled = true,
  loader = Hls.DefaultConfig.loader,
  className,
  loadingComponent,
  type = 'video/mp4',
  videoOverrides = { crossOrigin: 'anonymous' },
}: VideoPlayerProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const iosVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isVideoSupported = useMemo(() => (hlsEnabled ? Hls.isSupported() : true), [hlsEnabled]);
  const isIosHlsSupported = useMemo(
    () => document.createElement('video').canPlayType('application/vnd.apple.mpegurl') !== '',
    [],
  );

  console.log('isVideoSupported', isVideoSupported);
  console.log('isIosHlsSupported', isIosHlsSupported);
  console.log('hlsEnabled', hlsEnabled);

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

    if (hlsEnabled && isVideoSupported && !isIosHlsSupported) {
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
    }
    if (hlsEnabled && isIosHlsSupported) {
      const video = iosVideoRef.current;
      if (!video) return;
      videoWrapper.appendChild(video);
      video.src = src;
      Object.assign(video, videoOverrides);
      video.addEventListener('canplay', function () {
        setIsLoading(false);
      });
    } else {
      const video = document.createElement('video');
      video.className = 'cere-video';
      playerRef.current = video;
      videoWrapper.appendChild(video);
      video.src = src;
      Object.assign(video, videoOverrides);
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
  }, [hlsEnabled, isIosHlsSupported, isVideoSupported, loader, src, videoOverrides, wrapperRef]);

  if (!isVideoSupported && !isIosHlsSupported) {
    return (
      <div className="cere-video-wrapper flex items-center">
        <p className="w-full text-center">Your browser does not support playback of this type.</p>
      </div>
    );
  }

  if (isVideoSupported && !isIosHlsSupported) {
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
    <>
      <video controls {...videoOverrides}>
        <source src={src} type={hlsEnabled ? 'application/vnd.apple.mpegurl' : type} />
      </video>
    </>
  );
};
