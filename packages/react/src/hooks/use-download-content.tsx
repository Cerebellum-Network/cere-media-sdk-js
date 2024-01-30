import { NFT } from '@cere/media-sdk-client';
import FileDownload from 'js-file-download';
import { useState } from 'react';

import { useMediaClient } from '../hooks';

export interface UseDownloadContentReturn {
  download: () => Promise<void>;
  isLoading: boolean;
}

export const useDownloadContent = (nft: NFT, asset: string) => {
  const { client } = useMediaClient();
  const [isLoading, setIsLoading] = useState(false);

  const download = async (fileName?: string) => {
    setIsLoading(true);
    const {
      nftId,
      collection: { address: collectionAddress },
    } = nft;
    const response = await client?.getContent({ collectionAddress, nftId, asset });
    FileDownload(response!, fileName || formatFileName(collectionAddress, nftId, asset), response?.type);
    setIsLoading(false);
  };

  return { download, isLoading };
};

const formatFileName = (collectionAddress: string, nftId: number, asset: string) => {
  return `${collectionAddress}-${nftId}-${asset}`;
};
