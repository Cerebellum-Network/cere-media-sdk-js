import React from 'react';
import { NFT } from '@cere/media-sdk-client';
import { Box, Button, CircularProgress, IconButton, Modal, Skeleton, Typography } from '@mui/material';
import { NftContentView, useNftMetadata } from '@cere/media-sdk-react';
export const ClickableContentView = ({
  assetIndex,
  nftId,
  collectionAddress,
}: {
  assetIndex: number;
  nftId: number;
  collectionAddress: string;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const { metadata, isLoading, error } = useNftMetadata(collectionAddress, nftId);

  if (!isOpen) {
    return <Button onClick={onOpen}>View Content</Button>;
  }

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
          Error loading metadata for NFT {nftId} ({collectionAddress})
        </Typography>
      </Box>
    );
  }

  const nft = {
    collection: { address: collectionAddress },
    nftId: nftId,
  } as NFT;
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
          <NftContentView
            nft={nft}
            metadata={metadata!}
            assetIndex={assetIndex}
            loadingComponent={<CircularProgress size="30px" />}
          />
        </Box>
      </Box>
    </Modal>
  );
};
