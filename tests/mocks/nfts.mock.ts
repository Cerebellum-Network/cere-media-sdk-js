import { Collection, NFT, NftAsset, NftMetadata } from '@cere/media-sdk-client';

// The mocks in this file have been deployed to CereFans on development via the mockSigner in tests/mocks/signer.mock.ts
// If tests are failing, then it may be because this collection/nft/metadata/asset has been updated/deleted

export const mockCollection: Collection = {
  id: 45,
  address: '0x580711df26C49c4718e8BbEf73C4306cadFEF6Ae',
  name: 'Media SDK Collection',
  uri: 'https://cdn.testnet.cere.network/45/',
  tenant: 'DAVINCI',
};

export const mockNft: NFT = {
  id: 61,
  nftId: 3,
  supply: 3,
  collection: mockCollection,
};

export const mockAsset: NftAsset = {
  name: '16 april image second ',
  description: '16 april image second ',
  asset: 'https://cdn.testnet.cere.network/45/baebb4ietyzo5hq3h2gab65xbjdv3a3daetorgn3n7ltxwwiemgcotsh3hy',
  preview: 'https://cdn.testnet.cere.network/45/baebb4ibdpttnptdywepndp55nxqi7iju5vzzrx2tjdw6umvgmrw6ywhgn4',
  contentType: 'image/jpeg',
};

export const mockMetadata: NftMetadata = {
  name: '16 april image second ',
  description: '16 april image second ',
  preview: 'https://cdn.testnet.cere.network/45/baebb4ibdpttnptdywepndp55nxqi7iju5vzzrx2tjdw6umvgmrw6ywhgn4',
  assets: [mockAsset],
};
