import { useAddress } from '@thirdweb-dev/react';
import { useOwnedNfts } from '@cere/media-sdk-react';
import { Box, CircularProgress, Divider, Typography } from '@mui/material';
import { NftItem } from '../nft';

export const SolanaHackaton = () => {
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
            <NftItem key={nft.id} nft={nft} />
          ))}
        </Box>
      )}
    </Box>
  );
};
