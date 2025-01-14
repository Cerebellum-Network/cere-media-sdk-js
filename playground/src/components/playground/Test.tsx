import { VideoPlayer } from '@cere/media-sdk-react';

export const Test = () => {
  const url =
    'https://cdn.dragon.cere.network/1070/baear4ieax4777sevqr6bezphnporiafhdj4lbztnsf674apetdpt7rsrzm/0x1EFA4b344817D5416F9cCD6dF0AB6EB5031C2570-1-asset-0.mp4';

  return (
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
      videoOverrides={{
        autoPlay: true,
      }}
    />
  );
};
