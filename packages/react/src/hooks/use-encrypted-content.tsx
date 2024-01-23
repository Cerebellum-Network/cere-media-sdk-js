import { NFT, NftMetadata } from '@cere-media-sdk/client';
import useSWR from 'swr';

import { useMediaClient } from '.';

export const useEncryptedContent = (nft: NFT, metadata: NftMetadata, assetIndex: number) => {
  const { client, isLoading: isLoadingClient } = useMediaClient();

  const asset = metadata.assets[assetIndex];
  const contentType = asset.contentType;
  const identifier = `asset-${assetIndex}`;

  const isVideo = asset.contentType && ['video/mp4', 'video/webm', 'video/ogg'].includes(contentType);

  const getContent = async () => {
    const decryptedContent = await client?.getContent({
      collectionAddress: nft.collection.address,
      nftId: nft.nftId,
      asset: identifier,
    });
    if (!decryptedContent) return undefined;
    return URL.createObjectURL(decryptedContent);
  };

  const { data: content, isLoading: isLoadingContent } = useSWR(['encryptedContent', nft, metadata, assetIndex], () =>
    client ? getContent() : undefined,
  );

  return {
    isVideo,
    content,
    contentType,
    asset,
    isLoading: isLoadingClient || isLoadingContent,
  };
};
