import { useMediaClient } from '../hooks';

export interface ContentViewProps {
  collectionAddress: string;
  nftId: number;
  assetId: number;
}

export const ContentView = ({ collectionAddress, nftId, assetId }: ContentViewProps) => {
  const { client } = useMediaClient();

  if (!client) return;
};
