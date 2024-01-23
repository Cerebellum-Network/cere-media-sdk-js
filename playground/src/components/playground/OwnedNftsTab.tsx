import { useNftMetadata, useOwnedNfts } from '@cere-media-sdk/react';
import { NFT } from '@cere-media-sdk/client';
import { useAddress } from '@thirdweb-dev/react';
import { Box, CircularProgress, Divider, Link, Skeleton, Typography } from '@mui/material';

export const OwnedNftsTab = () => {
  const address = useAddress();
  const { ownedNfts, isLoading } = useOwnedNfts(address);

  return (
    <Box display="flex" flexDirection="column" gap="10px">
      <Typography>This page displays all of your owned NFts, fetched using useOwnedNfts() hook</Typography>
      <Divider />
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Box
          sx={{ width: '100%', height: '100%', typography: 'body1' }}
          display="flex"
          flexDirection="column"
          gap="5px"
        >
          {ownedNfts.map((nft) => (
            <NftItem nft={nft} />
          ))}
        </Box>
      )}
    </Box>
  );
};

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
          {metadata?.assets.map((asset) => (
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              gap="10px"
              p="10px"
              bgcolor="#e9f9fc"
              borderRadius="10px"
            >
              <img src={asset.preview} width="50px" />
              <Box display="flex" flexDirection="column" gap="5px" width="100%" textAlign="left">
                <Typography fontWeight="bold">Name: {asset.name}</Typography>
                <Typography>Description: {asset.description}</Typography>
                <Typography>
                  Preview:
                  <Link href={asset.preview} target="_blank">
                    {asset.preview}
                  </Link>
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
