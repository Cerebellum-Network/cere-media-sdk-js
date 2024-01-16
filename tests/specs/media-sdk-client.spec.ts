import { Deployment, FreeportApi, MediaSdkClient } from '@cere-media-sdk/client';

const deployments: Deployment[] = ['local', 'development', 'staging', 'production'];

describe('Media SDK Client', () => {
  it('should instantiate a new client', async () => {
    const client = await MediaSdkClient.create();
    expect(client).toBeInstanceOf(MediaSdkClient);
  });

  it('should instantiate a freeport api instance', async () => {
    const client = await MediaSdkClient.create();
    // @ts-ignore -- access internal property
    expect(client.freeportApi).toBeInstanceOf(FreeportApi);
  });

  it('should throw an error if the freeport api health check fails', async () => {
    FreeportApi.prototype.healthCheck = jest.fn(() => {
      throw new Error('Health check failed');
    });

    await expect(MediaSdkClient.create()).rejects.toThrow('Health check failed');
  });

  deployments.forEach((deployment) => {
    it(`should allow specifying a ${deployment} deployment environment`, async () => {
      FreeportApi.prototype.healthCheck = jest.fn(); // mock health check to pass

      const client = await MediaSdkClient.create({ deployment });
      expect(client.deployment).toEqual(deployment);
    });
  });
});
