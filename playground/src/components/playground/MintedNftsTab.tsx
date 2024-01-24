import { useMintedNfts } from '@cere-media-sdk/react';
import { Box, CircularProgress, Divider, Typography } from '@mui/material';
import { useAddress } from '@thirdweb-dev/react';
import { NftItem } from '../nft/NftItem';

export const MintedNftsTab = () => {
  const address = useAddress();
  const { mintedNfts, isLoading } = useMintedNfts(address);

  return (
    <Box display="flex" flexDirection="column" gap="10px">
      <Typography>This page displays all of your minted NFts, fetched using useMintedNfts() hook</Typography>
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
          {mintedNfts.map((nft) => (
            <NftItem key={nft.id} nft={nft} />
          ))}
        </Box>
      )}
    </Box>
  );
};
