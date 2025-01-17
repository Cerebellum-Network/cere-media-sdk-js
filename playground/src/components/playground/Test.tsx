import { VideoPlayer } from '@cere/media-sdk-react';
import { useRef } from 'react';

export const Test = () => {
  const url =
    'https://cdn.ddc-dragon.com/1070/baear4ieax4777sevqr6bezphnporiafhdj4lbztnsf674apetdpt7rsrzm/0x1EFA4b344817D5416F9cCD6dF0AB6EB5031C2570-1-asset-0.mp4';

  const realTimeRef = useRef(0);
  const is80PercentWatched = useRef(false);
  const lastTimeRef = useRef(0);

  const handleTimeUpdate = (currentTime: number, duration: number) => {
    console.log(currentTime, duration);
    if (currentTime < lastTimeRef.current) {
      return;
    }

    const timeDiff = currentTime - lastTimeRef.current;
    realTimeRef.current += timeDiff;

    if (realTimeRef.current / duration >= 0.8 && !is80PercentWatched.current) {
      is80PercentWatched.current = true;
      console.log('User watched 80% of the video!');
    }

    lastTimeRef.current = currentTime;
  };

  return (
    <div>
      <VideoPlayer
        hlsEnabled={false}
        src={url!}
        type="video/mp4"
        loadingComponent={<div />}
        onFullScreenChange={(fullScreen) => {
          console.log('onFullScreenChange', fullScreen);

          if (fullScreen) {
            document.body.setAttribute('data-video-fullscreen', '1');
          } else {
            document.body.removeAttribute('data-video-fullscreen');
          }
        }}
        onTimeUpdate={handleTimeUpdate}
        currentTime={20}
        videoOverrides={{
          autoPlay: false,
        }}
      />
    </div>
  );
};
