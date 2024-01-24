import './plyr.css';
import './styles.css';

import Hls, { HlsConfig } from 'hls.js';
import Plyr from 'plyr';
import { useEffect, useMemo, useRef, useState } from 'react';

interface VideoPlayerProps {
  src: string;
  loader?: HlsConfig['loader'];
}

const plyrOptions: Plyr.Options = {
  autoplay: true,
  iconUrl: '/icons.svg',
};

export const VideoPlayer = ({ src, loader }: VideoPlayerProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isSupported = useMemo(() => Hls.isSupported(), []);

  useEffect(() => {
    if (!isSupported) return;
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

    return () => {
      hls.destroy();
      playerRef.current = null;
    };
  }, [isSupported, loader, src, wrapperRef]);

  if (!isSupported) {
    return (
      <div className="cere-video-wrapper flex items-center">
        <p className="w-full text-center">Your browser does not support HLS.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="cere-video-wrapper" ref={wrapperRef} />
      {isLoading && (
        <div className="loading-container">
          <>Loading video...</>
        </div>
      )}
    </div>
  );
};
