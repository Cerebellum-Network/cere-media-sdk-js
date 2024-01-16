import { Deployment, FreeportApi, MediaSdkClient, Tenant } from '@cere-media-sdk/client';

import { mockSigner } from '../mocks/signer.mock';

const deployments: Deployment[] = ['local', 'development', 'staging', 'production'];
const tenants: Tenant[] = ['davinci', 'cerefans'];

describe('Media SDK Client', () => {
  it('should instantiate a new client', async () => {
    const client = await MediaSdkClient.create(mockSigner);
    expect(client).toBeInstanceOf(MediaSdkClient);
  });

  it('should instantiate a freeport api instance', async () => {
    const client = await MediaSdkClient.create(mockSigner);
    // @ts-ignore -- access internal property
    expect(client.freeportApi).toBeDefined();
  });

  it('should throw an error if the freeport api health check fails', async () => {
    FreeportApi.prototype.healthCheck = jest.fn(() => {
      throw new Error('Health check failed');
    });

    await expect(MediaSdkClient.create(mockSigner)).rejects.toThrow('Health check failed');
  });

  deployments.forEach((deployment) => {
    tenants.forEach((tenant) => {
      it(`should instantiate a new client for deployment ${deployment} and tenant ${tenant}`, async () => {
        FreeportApi.prototype.healthCheck = jest.fn(); // mock health check to pass
        FreeportApi.prototype.authenticate = jest.fn(); // mock auth to pass

        const client = await MediaSdkClient.create(mockSigner, { deployment, tenant });
        expect(client).toBeInstanceOf(MediaSdkClient);
      });
    });
  });
});
