import { FreeportNftAsset } from '@cere/media-sdk-client';
import { Box, styled, Typography } from '@mui/material';
import { ClickableContentView } from './ClickableContent.tsx';

const Image = styled('img')(() => ({
  width: '100%',
  height: '100%',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'auto',
  objectFit: 'cover',
  borderRadius: '12px',
}));

export const NftPreview = ({
  assetIndex,
  asset,
  title,
  description,
  nftId,
  collectionAddress,
}: {
  assetIndex: number;
  title: string;
  description: string;
  asset: FreeportNftAsset;
  nftId: number;
  collectionAddress: string;
}) => {
  return (
    <Box sx={{ maxWidth: '400px', height: 'fit-content', marginLeft: '20px' }}>
      <Image src={asset.preview} />
      <Typography>{title}</Typography>
      <Typography variant="caption">{description}</Typography>
      <ClickableContentView assetIndex={assetIndex} nftId={nftId} collectionAddress={collectionAddress} />
    </Box>
  );
};
