import { FreeportCollectionService } from '@cere/media-sdk-client';

import { mockSigner, mockCollection, mockNft, mockMetadata, mockAsset } from '../mocks';

const { nftId } = mockNft;
const { address } = mockCollection;

describe('Freeport Collection Service', () => {
  describe('create', () => {
    it('should instantiate a new client', async () => {
      const client = await FreeportCollectionService.create(mockSigner);
      expect(client).toBeDefined();
    });
  });

  describe('getNftMetadata', () => {
    it('should return the metadata for a given nft', async () => {
      const client = await FreeportCollectionService.create(mockSigner);
      const metadata = await client.getNftMetadata(address, nftId);
      expect(metadata).toBeDefined();
      expect(metadata).toEqual(mockMetadata);
    });

    it("should return the assets for the nft's metadata", async () => {
      const client = await FreeportCollectionService.create(mockSigner);
      const metadata = await client.getNftMetadata(address, nftId);
      expect(metadata.assets).toBeDefined();
      expect(metadata.assets).toBeInstanceOf(Array);
      expect(metadata.assets[0]).toEqual(mockAsset);
    });
  });

  describe('getNftAssets', () => {
    it('should return the assets for a given nft', async () => {
      const client = await FreeportCollectionService.create(mockSigner);
      const assets = await client.getNftAssets(address, nftId);
      expect(assets).toBeDefined();
      expect(assets).toBeInstanceOf(Array);
      expect(assets[0]).toEqual(mockAsset);
    });
  });
});
