import { useCollections } from '@cere-media-sdk/react';
import { Collection } from '@cere-media-sdk/client';
import { useAddress, useChain } from '@thirdweb-dev/react';
import { Box, CircularProgress, Divider, Link, Typography } from '@mui/material';

export const CollectionsTab = () => {
  const address = useAddress();
  const { collections, isLoading } = useCollections(address);

  return (
    <Box display="flex" flexDirection="column" gap="10px">
      <Typography>
        This page displays all of your Freeport Collections, fetched using the useCollection() hook
      </Typography>
      <Divider />
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ width: '100%', height: '100%', typography: 'body1' }}>
          {collections.map((collection) => (
            <CollectionItem collection={collection} />
          ))}
        </Box>
      )}
    </Box>
  );
};

const CollectionItem = ({ collection }: { collection: Collection }) => {
  return (
    <Box display="flex" flexDirection="row" alignItems="center" p="10px" gap="10px">
      <Typography fontWeight="bold">{collection.name}</Typography>
      <Typography fontStyle="italic">({collection.address})</Typography>
    </Box>
  );
};
