import { mockNfts } from './nfts.mock.ts';
import { NftPreview } from '../nft';
import { FreeportNftAsset } from '@cere/media-sdk-client';
import { Box } from '@mui/material';
import { ChainNamespace } from '@cere/media-sdk-client';
import { MediaSdkClientProvider } from '@cere/media-sdk-react';
import { useWallet } from '../../cere-wallet';
import { getWalletAccountType } from '../../cere-wallet/helper.ts';
import { Signer } from 'ethers';

export const NewTab = () => {
  const wallet = useWallet();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      {mockNfts.map(({ title, description, address, collectionAddress, assets, chainNamespace, chainId }) => {
        return assets.map((asset, idx) => {
          const signer = wallet.getSigner({ type: getWalletAccountType(chainNamespace as ChainNamespace) });
          return (
            <MediaSdkClientProvider
              key={`${collectionAddress}::${address}`}
              chainId={chainId}
              chainNamespace={chainNamespace as ChainNamespace}
              signer={signer as unknown as Signer}
            >
              <NftPreview
                key={`${collectionAddress}::${address}`}
                assetIndex={idx}
                title={title}
                description={description}
                asset={asset as FreeportNftAsset}
                nftId={Number(address)}
                collectionAddress={collectionAddress}
              />
            </MediaSdkClientProvider>
          );
        });
      })}
    </Box>
  );
};
