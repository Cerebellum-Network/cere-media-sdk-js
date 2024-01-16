import { Deployment, MediaSdkClient } from '@cere-media-sdk/client';

const deployments: Deployment[] = ['local', 'development', 'staging', 'production'];

describe('Media SDK Client', () => {
  it('should instantiate a new client', async () => {
    const client = new MediaSdkClient();
    expect(client).toBeInstanceOf(MediaSdkClient);
  });

  deployments.forEach((deployment) => {
    it(`should allow specifying a ${deployment} deployment environment`, () => {
      const client = new MediaSdkClient({ deployment });
      expect(client.deployment).toEqual(deployment);
    });
  });
});
