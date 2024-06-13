import React from 'react';
import { Box, Button, IconButton, Modal } from '@mui/material';
import { NftContentView } from '@cere/media-sdk-react';
import { FreeportNftAsset } from '@cere/media-sdk-client';

export const ClickableContentView = ({
  assetIndex,
  nftId,
  collectionAddress,
  asset,
}: {
  assetIndex: number;
  nftId: number;
  collectionAddress: string;
  asset: FreeportNftAsset;
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
          <NftContentView assetIndex={assetIndex} asset={asset} nftId={nftId} collectionAddress={collectionAddress} />
        </Box>
      </Box>
    </Modal>
  );
};
