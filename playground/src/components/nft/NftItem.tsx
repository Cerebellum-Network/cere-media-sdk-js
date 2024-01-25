/* eslint-disable react-hooks/rules-of-hooks */
import { NftMetadata, NFT, NftAsset } from '@cere-media-sdk/client';
import { useNftMetadata, ContentView, useDownloadContent } from '@cere-media-sdk/react';
import { Skeleton, Box, Typography, Link, Divider, Button, Modal, IconButton } from '@mui/material';
import React from 'react';

export const NftItem = ({ nft }: { nft: NFT }) => {
  const { metadata, isLoading, error } = useNftMetadata(nft.collection.address, nft.nftId);

  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" height="100px" />;
  }

  if (error) {
    return (
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        p="10px"
        gap="10px"
        bgcolor="#ff4848aa"
        borderRadius="10px"
      >
        <Typography fontWeight="bold">
          Error loading metadata for NFT {nft.nftId} ({nft.collection.address})
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      p="10px"
      gap="10px"
      bgcolor="#caf0fa"
      border="1px solid #00c3ff"
      borderRadius="10px"
    >
      <img src={metadata?.preview} width="100px" />
      <Box display="flex" flexDirection="column" gap="5px" width="100%" textAlign="left">
        <Typography fontWeight="bold">Name: {metadata?.name}</Typography>
        <Typography>Description: {metadata?.description}</Typography>

        <Typography>
          Preview:
          <Link href={metadata?.preview} target="_blank">
            {metadata?.preview}
          </Link>
        </Typography>
        <Divider />
        <Typography fontWeight="bold">Assets</Typography>
        <Box display="flex" flexDirection="column" gap="5px" width="100%" textAlign="left">
          {metadata?.assets.map((asset, index) => {
            return <AssetItem nft={nft} metadata={metadata} asset={asset} index={index} />;
          })}
        </Box>
      </Box>
    </Box>
  );
};

const AssetItem = ({
  nft,
  asset,
  metadata,
  index,
}: {
  nft: NFT;
  metadata: NftMetadata;
  asset: NftAsset;
  index: number;
}) => {
  const { download: downloadPreview, isLoading: isDownloadingPreview } = useDownloadContent(nft, `preview-${index}`);
  const { download: downloadAsset, isLoading: isDownloadingAsset } = useDownloadContent(nft, `asset-${index}`);

  return (
    <Box
      key={`${asset.name}-${index.toFixed()}`}
      display="flex"
      flexDirection="row"
      alignItems="center"
      gap="10px"
      p="10px"
      bgcolor="#e9f9fc"
      borderRadius="10px"
    >
      <Box display="flex" flexDirection="column" gap="5px" width="100%" textAlign="left">
        <Typography fontWeight="bold">Name: {asset.name}</Typography>
        <Typography>Description: {asset.description}</Typography>
      </Box>

      <Box>
        <img src={asset.preview} width="100px" />
        <Typography textAlign="center" fontWeight="bold">
          Preview
        </Typography>
        <Button onClick={() => downloadPreview()}>{isDownloadingPreview ? 'Loading...' : 'Preview'}</Button>
      </Box>

      <Box>
        <ClickableContentView nft={nft} metadata={metadata} assetIndex={index} />
        <Typography textAlign="center" fontWeight="bold">
          Asset
        </Typography>
        <Button onClick={() => downloadAsset()}>{isDownloadingAsset ? 'Loading...' : 'Download'}</Button>
      </Box>
    </Box>
  );
};

const ClickableContentView = ({
  nft,
  metadata,
  assetIndex,
}: {
  nft: NFT;
  metadata: NftMetadata;
  assetIndex: number;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  if (!isOpen) {
    return <Button onClick={onOpen}>View Content</Button>;
  }

  return (
    <Modal open={isOpen} onClose={onClose} aria-labelledby="modal-nft-content">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" width="100%" height="100%">
        <Box width="50%">
          <IconButton
            sx={{ position: 'absolute', top: '30px', right: '30px', color: 'lightblue' }}
            aria-label="close"
            onClick={onClose}
          >
            X
          </IconButton>
          <ContentView nft={nft} metadata={metadata} assetIndex={assetIndex} />
        </Box>
      </Box>
    </Modal>
  );
};
