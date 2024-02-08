import { MediaSdkClient, mediaClientConfig } from '@cere/media-sdk-client';
import useSWR from 'swr';

import { useMediaClient } from '.';

/**
 * Deconstructs a base URL to get the bucket and CID of a piece of content
 * @example https://cdn.testnet.cere.network/49/baebb4iancdrt67gzjndihdqn4qpwin6majvly4xajvuu4bjb3mdhs4hsxi
 */
export const deconstructCdnUrl = (cdnUrl: string) => {
  const url = new URL(cdnUrl);
  const [, bucketId, cid] = url.pathname.split('/');

  console.log({ bucketId, cid });
  return { bucketId, cid };
};

export const getServerSideUrl = async (
  src: string,
  collectionAddress: string,
  nftId: number,
  client: MediaSdkClient,
) => {
  const { bucketId, cid } = deconstructCdnUrl(src);
  const streamKey = await client.getStreamKey({
    collectionAddress,
    nftId,
    bucketId: parseInt(bucketId),
    cid,
  });

  const url = new URL(client?.config.freeportApiUrl || mediaClientConfig.development.davinci.freeportApiUrl);
  url.pathname = `/api/video/streaming/${streamKey}/${bucketId}/${cid}`;
  return url.href;
};

export const useServerSideUrl = ({
  src,
  collectionAddress,
  nftId,
}: {
  src: string;
  collectionAddress: string;
  nftId: number;
}) => {
  const { client } = useMediaClient();

  const { data: url, ...props } = useSWR(['serverSideUrl', src, collectionAddress, nftId, client], () =>
    client ? getServerSideUrl(src, collectionAddress, nftId, client) : '',
  );

  return {
    url,
    ...props,
  };
};
