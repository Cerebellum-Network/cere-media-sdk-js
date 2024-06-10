import { mockNfts } from './nfts.mock.ts';
import { NftPreview } from '../nft/NftPreview.tsx';
import { FreeportNftAsset } from '../nft/types.ts';
import { Box } from '@mui/material';
import { Web3authChainNamespace } from '@cere/media-sdk-client';
import { MediaSdkClientProvider } from '@cere/media-sdk-react';
import { useWallet } from '../../cere-wallet/wallet-context.tsx';

export const NewTab = () => {
  const { connector } = useWallet();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      {mockNfts.map(({ title, description, address, collectionAddress, assets, chainNamespace, chainId }) => {
        return assets.map((asset) => {
          const signer = connector.getWalletSigner(chainNamespace as Web3authChainNamespace);
          return (
            <MediaSdkClientProvider
              key={`${collectionAddress}::${address}`}
              chainId={chainId}
              chainNamespace={chainNamespace as Web3authChainNamespace}
              signer={signer}
            >
              <NftPreview
                key={`${collectionAddress}::${address}`}
                title={title}
                description={description}
                asset={asset as FreeportNftAsset}
                nftId={Number(address)}
                collectionAddress={collectionAddress}
                chainId={chainId}
                chainNamespace={chainNamespace as Web3authChainNamespace}
              />
            </MediaSdkClientProvider>
          );
        });
      })}
    </Box>
  );
};
