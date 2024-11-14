import { MediaSdkClient } from '@cere/media-sdk-client';
import { blake2b } from 'blakejs';
import type { LoaderCallbacks, LoaderConfiguration, LoaderContext, LoaderResponse, LoaderStats } from 'hls.js';
import nacl from 'tweetnacl';

interface EncryptionConfig {
  collectionAddress: string;
  nftId: number;
  assetId: string;
  client: MediaSdkClient;
}

export const createHlsEncryptionLoader = async (config: EncryptionConfig) => {
  const hlsModule = await import('hls.js');
  const Hls = hlsModule.default;

  const { collectionAddress, nftId, assetId, client } = config;
  let dek: Uint8Array | undefined;

  async function fetchDek(): Promise<Uint8Array> {
    if (dek) {
      return dek;
    }

    const hexDek = await client.getContentDek({
      collectionAddress,
      nftId: Number(nftId),
      asset: assetId,
    });

    dek = hexToU8a(hexDek);
    return dek;
  }

  function hexToU8a(hexString: string): Uint8Array {
    hexString = hexString.startsWith('0x') ? hexString.slice(2) : hexString;
    if (hexString.length % 2 !== 0) {
      console.warn('Hex string has an odd number of characters, adding a leading zero.');
      hexString = '0' + hexString;
    }
    const length = hexString.length / 2;
    const result = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      const byte = hexString.substr(i * 2, 2);
      result[i] = parseInt(byte, 16);
    }
    return result;
  }

  function naclDecrypt(encrypted: Uint8Array, nonce: Uint8Array, secretKey: Uint8Array): Uint8Array | null {
    return nacl.secretbox.open(encrypted, nonce, secretKey) || null;
  }

  function blake2AsU8a(input: Uint8Array, outputLength: number = 32): Uint8Array {
    return blake2b(input, undefined, outputLength);
  }

  function deriveDek(nonce: Uint8Array, masterDek: Uint8Array): Uint8Array {
    const seed = new Uint8Array(nonce.length + masterDek.length);
    seed.set(nonce);
    seed.set(masterDek, nonce.length);
    return blake2AsU8a(seed);
  }

  function destructureChunkCid(apiUrl: string) {
    const url = new URL(apiUrl);
    const isChunk = apiUrl.includes('chunk');
    const baseUrl = url.origin;

    if (!isChunk) {
      const [, bucketId, cid] = url.pathname.split('/');
      return { baseUrl, isChunk, encrypted: false, bucketId, cid };
    }

    const [, bucketId, , encodedCid] = url.pathname.split('/');
    const [enc, nonce, cid] = encodedCid.split('_');
    const encrypted = enc === 'enc';

    if (!encrypted) {
      return { cid: encodedCid, bucketId, isChunk, encrypted };
    }

    return {
      baseUrl,
      encrypted: enc === 'enc',
      isChunk,
      nonce,
      cid,
      bucketId,
    };
  }

  return class extends Hls.DefaultConfig.loader {
    load(context: LoaderContext, config: LoaderConfiguration, callbacks: LoaderCallbacks<LoaderContext>) {
      const { baseUrl, nonce, bucketId, cid, encrypted, isChunk } = destructureChunkCid(context.url);

      if (!isChunk) {
        super.load(context, config, callbacks);
        return;
      }

      if (encrypted) {
        context.url = `${baseUrl}/${bucketId}/${cid}`;
      }

      super.load(context, config, {
        ...callbacks,
        onSuccess: async (
          response: LoaderResponse,
          stats: LoaderStats,
          successContext: LoaderContext,
          networkDetails: unknown,
        ) => {
          try {
            if (!encrypted) {
              callbacks.onSuccess(response, stats, successContext, networkDetails);
              return;
            }
            const fetchedData = Buffer.from(response.data as ArrayBuffer);
            response.data = await this.decrypt(fetchedData, hexToU8a(nonce!));
            callbacks.onSuccess(response, stats, successContext, networkDetails);
          } catch (error) {
            console.log(error);
            callbacks.onError({ code: -1, text: 'Decryption failed' }, successContext, networkDetails, stats);
          }
        },
      });
    }

    async decrypt(data: Uint8Array, nonce: Uint8Array): Promise<ArrayBuffer> {
      const masterDek = await fetchDek();
      const derivedDek = deriveDek(nonce, masterDek);

      const result = naclDecrypt(data, nonce, derivedDek);
      if (result === null) {
        throw new Error("Can't decrypt data");
      }

      return Buffer.from(result.buffer);
    }
  };
};
