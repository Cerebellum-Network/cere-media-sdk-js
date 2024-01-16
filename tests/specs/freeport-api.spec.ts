import { FreeportApi } from '@cere-media-sdk/client';

import { mockSigner } from '../mocks';

describe('Freeport API Client', () => {
  it('should instantiate a new client', async () => {
    const client = await FreeportApi.create();
    expect(client).toBeDefined();
  });

  it('should allow specifying a custom freeport api url', async () => {
    FreeportApi.healthCheck = jest.fn(); // mock health check to pass
    const url = 'https://example.com';
    await FreeportApi.create({ freeportApiUrl: url });
    expect(FreeportApi.instance.defaults.baseURL).toEqual(url);
  });

  describe('getAuthMessage', () => {
    it('should return a valid auth message', async () => {
      await FreeportApi.create();
      const authMessage = await FreeportApi.getAuthMessage({ address: mockSigner.address });

      const regex = /Sign in to Cere with your wallet 0x[0-9a-fA-F]{40} at \d+/;
      expect(authMessage).toMatch(regex);
    });
  });

  describe('authenticate', () => {
    it('should set the auth headers', async () => {
      await FreeportApi.create();
      // @ts-ignore - authHeaders is private
      expect(FreeportApi.authHeaders).toBeUndefined();
      await FreeportApi.authenticate(mockSigner);
      // @ts-ignore - authHeaders is private
      expect(FreeportApi.authHeaders).toBeDefined();
    });

    it('should disconnect from the client', async () => {
      await FreeportApi.create();
      // @ts-ignore - authHeaders is private
      expect(FreeportApi.authHeaders).toBeUndefined();
      await FreeportApi.authenticate(mockSigner);
      // @ts-ignore - authHeaders is private
      expect(FreeportApi.authHeaders).toBeDefined();
      FreeportApi.disconnect();
      // @ts-ignore - authHeaders is private
      expect(FreeportApi.authHeaders).toBeUndefined();
    });
  });
});
