import { FreeportApiService } from '@cere/media-sdk-client';

import { mockCollection, mockNft, mockSigner, mockSignerNoAccess } from '../mocks';

const { nftId } = mockNft;
const { address: collectionAddress } = mockCollection;
const { address: walletAddress } = mockSigner;

describe('Freeport API Client', () => {
  describe('create', () => {
    it('should instantiate a new client', async () => {
      const client = await FreeportApiService.create();
      expect(client).toBeDefined();
    });
  });

  describe('getAuthMessage', () => {
    it('should return a valid auth message', async () => {
      const client = await FreeportApiService.create();
      const authMessage = await client.getAuthMessage({ address: mockSigner.address });

      const regex = /Sign in to Cere with your wallet 0x[0-9a-fA-F]{40} at \d+/;
      expect(authMessage).toMatch(regex);
    });
  });

  describe('authenticate', () => {
    it('should set the auth headers', async () => {
      const client = await FreeportApiService.create();
      // @ts-ignore - authHeaders is private
      expect(client.authHeaders).toBeUndefined();
      await client.authenticate(mockSigner);
      // @ts-ignore - authHeaders is private
      expect(client.authHeaders).toBeDefined();
    });

    it("should set the auth headers on the client's instance", async () => {
      const client = await FreeportApiService.create();
      await client.authenticate(mockSigner);
      // @ts-ignore - authHeaders is private
      const authHeaders = client.authHeaders as AuthHeaders;
      expect(client.instance.defaults.headers['x-message']).toEqual(authHeaders['x-message']);
      expect(client.instance.defaults.headers['x-signature']).toEqual(authHeaders['x-signature']);
      expect(client.instance.defaults.headers['x-public-key']).toEqual(authHeaders['x-public-key']);
    });

    it('should disconnect from the client', async () => {
      const client = await FreeportApiService.create();
      // @ts-ignore - authHeaders is private
      expect(client.authHeaders).toBeUndefined();
      await client.authenticate(mockSigner);
      // @ts-ignore - authHeaders is private
      expect(client.authHeaders).toBeDefined();
      client.disconnect();
      // @ts-ignore - authHeaders is private
      expect(client.authHeaders).toBeUndefined();
    });
  });

  describe('getCollections', () => {
    const { address } = mockSigner;

    it('should return a list of collections for a given address', async () => {
      const client = await FreeportApiService.create();
      const collections = await client.getCollections({ address });
      expect(collections).toBeInstanceOf(Array);
    });
  });

  describe('getMintedNfts', () => {
    const { address } = mockSigner;

    it('should return a list of nfts for a given address', async () => {
      const client = await FreeportApiService.create();
      const nfts = await client.getMintedNfts({ address });
      expect(nfts).toBeInstanceOf(Array);
    });
  });

  describe('getOwnedNfts', () => {
    const { address } = mockSigner;

    it('should return a list of nfts for a given address', async () => {
      const client = await FreeportApiService.create();
      const nfts = await client.getOwnedNfts({ address });
      expect(nfts).toBeInstanceOf(Array);
    });
  });

  describe('getCanAccess', () => {
    it('should return true if the address can access the NFT', async () => {
      const client = await FreeportApiService.create();
      const canAccess = await client.getCanAccess({ nftId, walletAddress, collectionAddress });
      expect(canAccess).toEqual(true);
    });

    it('should return false if the address cannot access the NFT', async () => {
      const client = await FreeportApiService.create();
      const canAccess = await client.getCanAccess({
        nftId,
        walletAddress: mockSignerNoAccess.address,
        collectionAddress,
      });
      expect(canAccess).toEqual(false);
    });
  });

  describe('getContentDek', () => {
    it('should return a valid DEK if authenticated', async () => {
      const client = await FreeportApiService.create();
      await client.authenticate(mockSigner);
      const dek = await client.getContentDek({ nftId, asset: 'asset', collectionAddress });
      expect(dek).toEqual(expect.any(String));
    });

    it('should throw an error if not authenticated', async () => {
      const client = await FreeportApiService.create();
      await expect(client.getContentDek({ nftId, asset: 'asset', collectionAddress })).rejects.toThrow();
    });

    it('should throw an error if authenticated with the wrong signer', async () => {
      const client = await FreeportApiService.create();
      await client.authenticate(mockSignerNoAccess);
      await expect(client.getContentDek({ nftId, asset: 'asset', collectionAddress })).rejects.toThrow();
    });
  });

  describe('getContent', () => {
    it("should return the NFT's content if authenticated", async () => {
      const client = await FreeportApiService.create();
      await client.authenticate(mockSigner);
      const content = await client.getContent({ nftId, asset: 'asset', collectionAddress });
      expect(content).toBeDefined();
    });

    it('should throw an error if not authenticated', async () => {
      const client = await FreeportApiService.create();
      await expect(client.getContent({ nftId, asset: 'asset', collectionAddress })).rejects.toThrow();
    });

    it('should throw an error if authenticated with the wrong signer', async () => {
      const client = await FreeportApiService.create();
      await client.authenticate(mockSignerNoAccess);
      await expect(client.getContent({ nftId, asset: 'asset', collectionAddress })).rejects.toThrow();
    });
  });
});
