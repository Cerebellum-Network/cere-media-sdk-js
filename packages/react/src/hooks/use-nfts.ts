import useSWR from 'swr';

import { useMediaClient } from './use-media-client';

/**
 * Get the metadata for a Freeport NFT
 * @param collectionAddress The address of the collection to get the NFTs for
 * @param nftId The ID of the NFT to get the metadata for
 * @returns The metadata for the NFT
 */
export const useNftMetadata = (collectionAddress: string, nftId: number) => {
  const { client, isLoading: isLoadingClient } = useMediaClient();

  const {
    data: metadata,
    isLoading: isLoadingMetadata,
    ...props
  } = useSWR(['nftMetadata', collectionAddress, nftId, client], () =>
    client ? client.getNftMetadata({ contractAddress: collectionAddress, nftId }) : undefined,
  );

  return {
    metadata,
    isLoading: isLoadingClient || isLoadingMetadata,
    ...props,
  };
};
