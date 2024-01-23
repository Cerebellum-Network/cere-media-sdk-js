import { useMediaClient } from '.';
import useSWR from 'swr';

/**
 * Get all of the Freeport NFTs minted by an address
 * @param address The address to get the NFTs for
 * @returns The NFTs owned by the address
 */
export const useMintedNfts = (address?: string) => {
  const { client, isLoading: isLoadingClient } = useMediaClient();

  const {
    data: mintedNfts,
    isLoading: isLoadingNfts,
    ...props
  } = useSWR(['mintedNfts', address, client], () => (client ? client.getMintedNfts({ address }) : []));

  return {
    mintedNfts: mintedNfts || [],
    isLoading: isLoadingClient || isLoadingNfts,
    ...props,
  };
};

/**
 * Get all of the Freeport NFTs minted by an address
 * @param address The address to get the NFTs for
 * @returns The NFTs minted by the address
 */
export const useOwnedNfts = (address?: string) => {
  const { client, isLoading: isLoadingClient } = useMediaClient();

  const {
    data: ownedNfts,
    isLoading: isLoadingNfts,
    ...props
  } = useSWR(['ownedNfts', address, client], () => (client ? client.getOwnedNfts({ address }) : []));

  return {
    ownedNfts: ownedNfts || [],
    isLoading: isLoadingClient || isLoadingNfts,
    ...props,
  };
};

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
