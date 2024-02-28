import { ReactNode } from 'react';

export interface EncryptedAudioPlayerOptions {
  /**
   * HTML5 Audio tag autoPlay property
   */
  autoPlay?: boolean;
  /**
   * Whether to play audio after src prop is changed
   */
  autoPlayAfterSrcChange?: boolean;
  /**
   * custom classNames
   */
  className?: string;
  /**
   * The time interval to trigger onListen
   */
  listenInterval?: number;
  progressJumpStep?: number;
  progressJumpSteps?: {
    backward?: number;
    forward?: number;
  };
  volumeJumpStep?: number;
  loop?: boolean;
  muted?: boolean;
  crossOrigin?: React.AudioHTMLAttributes<HTMLAudioElement>['crossOrigin'];
  mediaGroup?: string;
  hasDefaultKeyBindings?: boolean;
  onAbort?: (e: Event) => void;
  onCanPlay?: (e: Event) => void;
  onCanPlayThrough?: (e: Event) => void;
  onEnded?: (e: Event) => void;
  onPlaying?: (e: Event) => void;
  onSeeking?: (e: Event) => void;
  onSeeked?: (e: Event) => void;
  onStalled?: (e: Event) => void;
  onSuspend?: (e: Event) => void;
  onLoadStart?: (e: Event) => void;
  onLoadedMetaData?: (e: Event) => void;
  onLoadedData?: (e: Event) => void;
  onWaiting?: (e: Event) => void;
  onEmptied?: (e: Event) => void;
  onError?: (e: Event) => void;
  onListen?: (e: Event) => void;
  onVolumeChange?: (e: Event) => void;
  onPause?: (e: Event) => void;
  onPlay?: (e: Event) => void;
  onClickPrevious?: (e: React.SyntheticEvent) => void;
  onClickNext?: (e: React.SyntheticEvent) => void;
  onPlayError?: (err: Error) => void;
  onChangeCurrentTimeError?: () => void;
  defaultCurrentTime?: ReactNode;
  defaultDuration?: ReactNode;
  volume?: number;
  showJumpControls?: boolean;
  showSkipControls?: boolean;
  showDownloadProgress?: boolean;
  showFilledProgress?: boolean;
  showFilledVolume?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
}
