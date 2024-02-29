/* eslint-disable @typescript-eslint/no-unused-vars */
import { EncryptedAudioPlayer } from '@cere/media-sdk-react';
import { CircularProgress } from '@mui/material';

export const AudioExample = () => {
  return <EncryptedDdcAudio />;
};

const collectionAddress = '0x0b785F2a098851646aa128aE4c1e2CE5B4Ee96bB';
const nftId = 2;
const assetIndex = 1;
const publicSrc = '';
const encryptedSrc = 'https://cdn.testnet.cere.network/45/baebb4iahqfiw2b3z3qfa5vet2rd6cuklijdf2hhgkwecdt2fgjajwuae7m';

const EncryptedDdcAudio = () => (
  <EncryptedAudioPlayer
    collectionAddress={collectionAddress}
    nftId={nftId}
    assetIndex={assetIndex}
    loadingComponent={<CircularProgress />}
    playerOverrides={{ autoPlay: true }}
  />
);
