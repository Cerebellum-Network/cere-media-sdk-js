import { Web3authChainNamespace } from '@cere/media-sdk-client';
import useSWR from 'swr';

import { useMediaClient } from '.';

export const useEncryptedContent = (
  nftId: number,
  collectionAddress: string,
  asset: { name: string; description: string; preview: string; asset: string; contentType: string },
  chainId: string,
  chainNamespace: Web3authChainNamespace,
) => {
  const { client, isLoading: isLoadingClient } = useMediaClient();

  const contentType = asset?.contentType;
  const identifier = `asset-${asset.asset.split('/').pop()}`;

  const isVideo = asset?.contentType && ['video/mp4', 'video/webm', 'video/ogg'].includes(contentType);

  const getContent = async () => {
    const decryptedContent = await client?.getContent({
      collectionAddress,
      nftId,
      asset: identifier,
      chainId,
      chainNamespace,
    });
    if (!decryptedContent) return undefined;
    return URL.createObjectURL(decryptedContent);
  };

  const { data: content, isLoading: isLoadingContent } = useSWR(['encryptedContent', nftId, collectionAddress], () =>
    // If the content is video, it is not fetched here. This requires using the VideoPlayer with HlsEncryptionLoader
    client && !isVideo ? getContent() : undefined,
  );

  return {
    isVideo,
    content,
    contentType,
    isLoading: isLoadingClient || isLoadingContent,
  };
};
