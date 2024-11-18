import { useDdcClient } from 'playground/src/ddc-client';
import React, { VideoHTMLAttributes, useState, useEffect } from 'react';

// import { useEncryptedContent, useMediaClient, useNftMetadata, useServerSideUrl } from '../../hooks';

import { createHlsDdcLoader } from './HlsDdcLoader';
import { createHlsEncryptionLoader } from './HlsEncryptionLoader';
// import { IosVideoPlayer } from './IosVideoPlayer';
import { VideoPlayer } from './VideoPlayer';

export interface EncryptedVideoPlayerProps {
  bucketId: bigint;
  cid: string;
  dek: string;
  serverSide?: boolean;
  className?: string;
  loadingComponent?: React.ReactNode;
  videoOverrides?: VideoHTMLAttributes<HTMLVideoElement>;
}

export const EncryptedVideoPlayer = ({ bucketId, cid, dek, serverSide, ...props }: EncryptedVideoPlayerProps) => {
  const [loader, setLoader] = useState<any>(null);
  const ddcClient = useDdcClient();

  useEffect(() => {
    ddcClient.connect();
  }, []);
  useEffect(() => {
    const initializeLoader = async () => {
      let loaderInstance = createHlsDdcLoader({
        bucketId,
        cid,
        ddcClient,
      });

      if (dek != '') {
        console.log('WRAP DDC LOADER TO ENCRYPTION');
        loaderInstance = await createHlsEncryptionLoader({ dek: dek, loaderInstance });
      }
      setLoader(() => loaderInstance); // Set the loader instance once it's ready
    };

    initializeLoader();
  }, []);

  if (!loader) {
    return <></>;
  }

  /*  if (serverSide && url) {
    return <IosVideoPlayer hlsEnabled src={url} {...props} loader={loader} />;
  }*/

  return <VideoPlayer src={cid} loader={loader} {...props} />;
};
