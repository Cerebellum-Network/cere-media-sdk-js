import { mockNfts } from './nfts.mock.ts';
import { NftPreview } from '../nft/NftPreview.tsx';
import { FreeportNftAsset } from '../nft/types.ts';
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
      {mockNfts.map(({ title, description, address, collectionAddress, assets, chainNamespace, chainId }, idx) => {
        return assets.map((asset) => {
          const signer = wallet.getSigner({ type: getWalletAccountType(chainNamespace as ChainNamespace) });
          console.log('SIGNER', signer);
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
                chainId={chainId}
                chainNamespace={chainNamespace as ChainNamespace}
              />
            </MediaSdkClientProvider>
          );
        });
      })}
    </Box>
  );
};
