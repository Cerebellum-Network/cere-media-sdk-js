import { Collection, NFT, NftAsset, NftMetadata } from '@cere/media-sdk-client';

// The mocks in this file have been deployed to CereFans on development via the mockSigner in tests/mocks/signer.mock.ts
// If tests are failing, then it may be because this collection/nft/metadata/asset has been updated/deleted

export const mockCollection: Collection = {
  id: 317,
  address: '0x0C304083B4089A6C0e5E9dceAB72949B9Cf2a75e',
  name: 'Media SDK Collection',
  uri: 'https://cdn.testnet.cere.network/49/',
  tenant: 'CEREFANS',
};

export const mockNft: NFT = {
  id: 243,
  nftId: 1,
  supply: 100,
  collection: mockCollection,
};

export const mockAsset: NftAsset = {
  name: 'Media SDK NFT',
  description: 'This is a test NFT for the Media SDK',
  asset: 'https://cdn.testnet.cere.network/49/baebb4ifvhmacyrkpyi3f4xoyxsubabndqx6oumcsa3i7a2nnt22x62r6u4',
  preview: 'https://cdn.testnet.cere.network/49/baebb4idpt6ki43v76k73iutlgrwqirpsu6ywxl3kkyy65wu53muyrbdpgi',
  contentType: 'image/png',
};

export const mockMetadata: NftMetadata = {
  name: 'Media SDK NFT',
  description: 'This is a test NFT for the Media SDK',
  preview: 'https://cdn.testnet.cere.network/49/baebb4idpt6ki43v76k73iutlgrwqirpsu6ywxl3kkyy65wu53muyrbdpgi',
  assets: [mockAsset],
};
