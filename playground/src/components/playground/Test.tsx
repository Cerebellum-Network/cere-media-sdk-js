import { VideoPlayer } from '@cere/media-sdk-react';
import { EventSource, UriSigner } from '@cere-activity-sdk/events';

export const Test = () => {
  const url =
    'https://cdn.dragon.cere.network/1070/baear4ieax4777sevqr6bezphnporiafhdj4lbztnsf674apetdpt7rsrzm/0x1EFA4b344817D5416F9cCD6dF0AB6EB5031C2570-1-asset-0.mp4';

  const signer = new UriSigner('wealth ski target play spring pizza jaguar shoe thrive wine soft bitter', {
    type: 'ethereum',
  });

  const eventSource = new EventSource(signer, {
    appId: '2102',
    dispatchUrl: 'https://stage-ai-event-service.core-stage.aws.cere.io',
    listenUrl: 'https://ai-socket.stage.cere.io',
  });

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
      publicKey="31a4e51cfcc492da79838bd4a2a59d694280e3feada2ff5f811f4916d9fbb0ac"
      videoOverrides={{
        autoPlay: true,
      }}
      eventSource={eventSource}
    />
  );
};
