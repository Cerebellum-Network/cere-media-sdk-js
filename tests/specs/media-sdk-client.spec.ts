import { Deployment, FreeportApiService, MediaSdkClient, Tenant } from '@cere-media-sdk/client';

import { mockSigner } from '../mocks/signer.mock';

const deployments: Deployment[] = ['local', 'development', 'staging', 'production'];
const tenants: Tenant[] = ['davinci', 'cerefans'];

describe('Media SDK Client', () => {
  describe('client', () => {
    it('should instantiate a new client', async () => {
      const client = await MediaSdkClient.create(mockSigner);
      expect(client).toBeInstanceOf(MediaSdkClient);
    });

    it('should instantiate a freeport api instance', async () => {
      const client = await MediaSdkClient.create(mockSigner);
      // @ts-ignore -- access internal property
      expect(client.freeportApi).toBeDefined();
    });

    it('should instantiate a freeport collection instance', async () => {
      const client = await MediaSdkClient.create(mockSigner);
      // @ts-ignore -- access internal property
      expect(client.freeportCollection).toBeDefined();
    });

    it('should throw an error if the freeport api health check fails', async () => {
      FreeportApiService.prototype.healthCheck = jest.fn(() => {
        throw new Error('Health check failed');
      });

      await expect(MediaSdkClient.create(mockSigner)).rejects.toThrow('Health check failed');
    });

    deployments.forEach((deployment) => {
      tenants.forEach((tenant) => {
        it(`should instantiate a new client for deployment ${deployment} and tenant ${tenant}`, async () => {
          FreeportApiService.prototype.healthCheck = jest.fn(); // mock health check to pass
          FreeportApiService.prototype.authenticate = jest.fn(); // mock auth to pass

          const client = await MediaSdkClient.create(mockSigner, { deployment, tenant });
          expect(client).toBeInstanceOf(MediaSdkClient);
        });
      });
    });
  });

  describe('getCollections', () => {
    const { address } = mockSigner;

    it('should return a list of collections for a given address', async () => {
      const client = await MediaSdkClient.create(mockSigner);
      const collections = await client.getCollections({ address });
      expect(collections).toBeDefined();
      expect(collections).toBeInstanceOf(Array);
    });
  });

  describe('getMintedNfts', () => {
    const { address } = mockSigner;

    it('should return a list of nfts for a given address', async () => {
      const client = await MediaSdkClient.create(mockSigner);
      const nfts = await client.getMintedNfts({ address });
      expect(nfts).toBeDefined();
      expect(nfts).toBeInstanceOf(Array);
    });
  });

  describe('getOwnedNfts', () => {
    const { address } = mockSigner;

    it('should return a list of nfts for a given address', async () => {
      const client = await MediaSdkClient.create(mockSigner);
      const nfts = await client.getOwnedNfts({ address });
      expect(nfts).toBeDefined();
      expect(nfts).toBeInstanceOf(Array);
    });
  });
});
