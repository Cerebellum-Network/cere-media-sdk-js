import { FreeportApi } from '@cere-media-sdk/client';

import { mockSigner } from '../mocks';

describe('Freeport API Client', () => {
  it('should instantiate a new client', async () => {
    const client = await FreeportApi.create();
    expect(client).toBeDefined();
  });

  it('should allow specifying a custom freeport api url', async () => {
    FreeportApi.prototype.healthCheck = jest.fn(); // mock health check to pass
    const url = 'https://example.com';
    const client = await FreeportApi.create({ freeportApiUrl: url });
    expect(client.instance.defaults.baseURL).toEqual(url);
  });

  describe('getAuthMessage', () => {
    it('should return a valid auth message', async () => {
      const client = await FreeportApi.create();
      const authMessage = await client.getAuthMessage({ address: mockSigner.address });

      const regex = /Sign in to Cere with your wallet 0x[0-9a-fA-F]{40} at \d+/;
      expect(authMessage).toMatch(regex);
    });
  });

  describe('authenticate', () => {
    it('should set the auth headers', async () => {
      const client = await FreeportApi.create();
      // @ts-ignore - authHeaders is private
      expect(client.authHeaders).toBeUndefined();
      await client.authenticate(mockSigner);
      // @ts-ignore - authHeaders is private
      expect(client.authHeaders).toBeDefined();
    });

    it("should set the auth headers on the client's instance", async () => {
      const client = await FreeportApi.create();
      await client.authenticate(mockSigner);
      // @ts-ignore - authHeaders is private
      const authHeaders = client.authHeaders as AuthHeaders;
      expect(client.instance.defaults.headers['x-message']).toEqual(authHeaders['x-message']);
      expect(client.instance.defaults.headers['x-signature']).toEqual(authHeaders['x-signature']);
      expect(client.instance.defaults.headers['x-public-key']).toEqual(authHeaders['x-public-key']);
    });

    it('should disconnect from the client', async () => {
      const client = await FreeportApi.create();
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
});
