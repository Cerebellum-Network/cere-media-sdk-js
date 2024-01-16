import { Deployment, FreeportApi, MediaSdkClient } from '@cere-media-sdk/client';

import { mockSigner } from '../mocks/signer.mock';

const deployments: Deployment[] = ['local', 'development', 'staging', 'production'];

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
    FreeportApi.healthCheck = jest.fn(() => {
      throw new Error('Health check failed');
    });

    await expect(MediaSdkClient.create(mockSigner)).rejects.toThrow('Health check failed');
  });

  deployments.forEach((deployment) => {
    it(`should allow specifying a ${deployment} deployment environment`, async () => {
      FreeportApi.healthCheck = jest.fn(); // mock health check to pass

      const client = await MediaSdkClient.create(mockSigner, { deployment });
      expect(client.deployment).toEqual(deployment);
    });
  });
});
