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
      appId="2095"
      dispatchUrl="https://dev-event-service.core-dev.aws.cere.io"
      listenUrl="https://socket.dev.cere.io"
      publicKey="31a4e51cfcc492da79838bd4a2a59d694280e3feada2ff5f811f4916d9fbb0ac"
      videoOverrides={{
        autoPlay: true,
      }}
    />
  );
};
