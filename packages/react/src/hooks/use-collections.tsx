import { useMediaClient } from '.';
import useSWR from 'swr';

/**
 * Get all of the Freeport Collections for an address
 * @param address The address to get the collections for
 *
 */
export const useCollections = (address?: string) => {
  const { client, isLoading: isLoadingClient } = useMediaClient();

  const {
    data: collections,
    isLoading: isLoadingCollections,
    ...props
  } = useSWR(['collections', address, client], () => (client ? client.getCollections({ address }) : []));

  return {
    collections: collections || [],
    isLoading: isLoadingClient || isLoadingCollections,
    ...props,
  };
};
