import { ChainNamespace } from '@cere/media-sdk-client';

import { Deployment, FreeportApiService, MediaSdkClient, Tenant } from '../../packages/client';
import { mockSigner } from '../mocks';

const deployments: Deployment[] = ['local', 'development', 'staging', 'production'];
const tenants: Tenant[] = ['davinci', 'cerefans'];

const mockChainId = '8002';
const mockChainNamespace = ChainNamespace.EIP155;

describe('Media SDK Client', () => {
  describe('client', () => {
    it.skip('should instantiate a new client', async () => {
      const client = await MediaSdkClient.create(mockChainId, mockChainNamespace, mockSigner);
      expect(client).toBeInstanceOf(MediaSdkClient);
    });

    it.skip('should instantiate a freeport api instance', async () => {
      const client = await MediaSdkClient.create(mockChainId, mockChainNamespace, mockSigner);
      // @ts-ignore -- access internal property
      expect(client.freeportApi).toBeDefined();
    });

    it.skip('should instantiate a freeport collection instance', async () => {
      const client = await MediaSdkClient.create(mockChainId, mockChainNamespace, mockSigner);
      // @ts-ignore -- access internal property
      expect(client.freeportCollection).toBeDefined();
    });

    it('should throw an error if the freeport api health check fails', async () => {
      FreeportApiService.prototype.healthCheck = jest.fn(() => {
        throw new Error('Health check failed');
      });

      await expect(MediaSdkClient.create(mockChainId, mockChainNamespace, mockSigner)).rejects.toThrow(
        'Health check failed',
      );
    });

    deployments.forEach((deployment) => {
      tenants.forEach((tenant) => {
        it(`should instantiate a new client for deployment ${deployment} and tenant ${tenant}`, async () => {
          FreeportApiService.prototype.healthCheck = jest.fn(); // mock health check to pass
          FreeportApiService.prototype.authenticate = jest.fn(); // mock auth to pass

          const client = await MediaSdkClient.create(mockChainId, mockChainNamespace, mockSigner, {
            deployment,
            tenant,
          });
          expect(client).toBeInstanceOf(MediaSdkClient);
        });
      });
    });
  });
});
