import { FreeportNftAsset } from './types.ts';
import { Box, styled, Typography } from '@mui/material';
import { ClickableContentView } from './ClickableContent.tsx';
import { Web3authChainNamespace } from '@cere/media-sdk-client';

const Image = styled('img')(() => ({
  width: '100%',
  height: '100%',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'auto',
  objectFit: 'cover',
  borderRadius: '12px',
}));

export const NftPreview = ({
  asset,
  title,
  description,
  nftId,
  collectionAddress,
  chainId,
  chainNamespace,
}: {
  title: string;
  description: string;
  asset: FreeportNftAsset;
  nftId: number;
  collectionAddress: string;
  chainId: string;
  chainNamespace: Web3authChainNamespace;
}) => {
  return (
    <Box sx={{ maxWidth: '400px', marginLeft: '20px' }}>
      <Image src={asset.preview} />
      <Typography>{title}</Typography>
      <Typography variant="caption">{description}</Typography>
      <ClickableContentView
        nftId={nftId}
        collectionAddress={collectionAddress}
        chainNamespace={chainNamespace}
        chainId={chainId}
        asset={asset}
      />
    </Box>
  );
};
