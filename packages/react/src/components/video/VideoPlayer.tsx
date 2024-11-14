import './plyr.css';
import './styles.css';

import { ActivityEvent, EventSource, UriSignerOptions } from '@cere-activity-sdk/events';
import { u8aToU8a } from '@polkadot/util';
import clsx from 'clsx';
import Hls, { HlsConfig } from 'hls.js';
import Plyr from 'plyr';
import { VideoHTMLAttributes, useEffect, useMemo, useRef, useState, useCallback } from 'react';

import { PublicKeySigner } from '../../classes/PublicKeySigner';

interface VideoPlayerProps {
  src: string;
  hlsEnabled?: boolean;
  loader?: HlsConfig['loader'];
  className?: string;
  loadingComponent?: React.ReactNode;
  type?: string;
  videoOverrides?: VideoHTMLAttributes<HTMLVideoElement>;
  appId?: string;
  dispatchUrl?: string;
  listenUrl?: string;
  walletType?: UriSignerOptions['type'];
  base64PublicKey?: string;
}

export const VideoPlayer = ({
  src,
  hlsEnabled = true,
  loader = Hls.DefaultConfig.loader,
  className,
  loadingComponent,
  type,
  videoOverrides = { crossOrigin: 'anonymous' },
  appId,
  dispatchUrl,
  listenUrl,
  walletType,
  base64PublicKey,
}: VideoPlayerProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isVideoSupported = useMemo(() => (hlsEnabled ? Hls.isSupported() : true), [hlsEnabled]);

  const publicKeyArray = u8aToU8a(base64PublicKey);

  const signer = useMemo(
    () =>
      new PublicKeySigner(publicKeyArray, {
        type: walletType,
      }),
    [],
  );

  const eventSource = useMemo(() => {
    const source = new EventSource(signer, {
      appId: appId!,
      dispatchUrl: dispatchUrl!,
      listenUrl: listenUrl!,
    });

    source.isReady().then(
      (ready) => {
        console.log('EventSource ready:', ready);
      },
      (error) => {
        console.error('EventSource error:', error);
      },
    );

    return source;
  }, []);

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

    if (!isVideoSupported) {
      return;
    }

    if (hlsEnabled) {
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

        player.on('play', async () => {
          const event = new ActivityEvent('VIDEO_PLAY', { src });
          await eventSource.dispatchEvent(event);
        });
        player.on('pause', async () => {
          const event = new ActivityEvent('VIDEO_PAUSE', { src });
          await eventSource.dispatchEvent(event);
        });
        player.on('seeked', async () => {
          const event = new ActivityEvent('VIDEO_SEEK', { src, currentTime: player.currentTime });
          await eventSource.dispatchEvent(event);
        });
        player.on('ended', async () => {
          const event = new ActivityEvent('VIDEO_ENDED', { src });
          await eventSource.dispatchEvent(event);
        });

        player.on('canplaythrough', () => setIsLoading(false));
      });

      hls.on(Hls.Events.FRAG_LOADED, () => setIsLoading(false));
      hls.loadSource(src);
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

      player.on('play', async () => {
        const event = new ActivityEvent('VIDEO_PLAY', { src });
        await eventSource.dispatchEvent(event);
      });
      player.on('pause', async () => {
        const event = new ActivityEvent('VIDEO_PAUSE', { src });
        await eventSource.dispatchEvent(event);
      });
      player.on('seeked', async () => {
        const event = new ActivityEvent('VIDEO_SEEK', { src, currentTime: player.currentTime });
        await eventSource.dispatchEvent(event);
      });
      player.on('ended', async () => {
        const event = new ActivityEvent('VIDEO_ENDED', { src });
        await eventSource.dispatchEvent(event);
      });

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
  }, [isVideoSupported, loader, src, wrapperRef, eventSource]);

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
