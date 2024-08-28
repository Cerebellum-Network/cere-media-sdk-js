import { MediaSdkClient } from '@cere/media-sdk-client';
import { blake2b } from 'blakejs';
import type {
  HlsConfig,
  LoaderCallbacks,
  LoaderConfiguration,
  LoaderContext,
  LoaderResponse,
  LoaderStats,
} from 'hls.js';
import nacl from 'tweetnacl';

let Hls: typeof import('hls.js').default | null = null;

export class HlsEncryptionLoader {
  private static client: MediaSdkClient;
  public static collectionAddress: string;
  public static nftId: number;
  public static assetId: string;
  public static dek?: Uint8Array;

  public static create({
    collectionAddress,
    nftId,
    assetId,
    client,
  }: {
    collectionAddress: string;
    nftId: number;
    assetId: string;
    client: MediaSdkClient;
  }) {
    this.collectionAddress = collectionAddress;
    this.nftId = nftId;
    this.assetId = assetId;
    this.dek = undefined;
    this.client = client;

    return this;
  }

  async load(context: LoaderContext, config: LoaderConfiguration, callbacks: LoaderCallbacks<LoaderContext>) {
    if (!Hls) {
      const hlsModule = await import('hls.js');
      Hls = hlsModule.default;
    }

    const baseLoaderClass = Hls.DefaultConfig.loader;

    if (!baseLoaderClass) {
      throw new Error('HLS base loader class is not available.');
    }

    const fullConfig: LoaderConfiguration & HlsConfig = {
      ...Hls.DefaultConfig,
      ...config,
    };

    const baseLoaderInstance = new baseLoaderClass(fullConfig);

    const { baseUrl, nonce, bucketId, cid, encrypted, isChunk } = this.destructureChunkCid(context.url);

    if (!isChunk) {
      baseLoaderInstance.load(context, fullConfig, callbacks);
      return;
    }

    if (encrypted) {
      context.url = `${baseUrl}/${bucketId}/${cid}`;
    }

    baseLoaderInstance.load(context, fullConfig, {
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
          response.data = await this.decrypt(fetchedData, HlsEncryptionLoader.hexToU8a(nonce!));

          callbacks.onSuccess(response, stats, successContext, networkDetails);
        } catch (error) {
          console.log(error);
          callbacks.onError({ code: -1, text: 'Decryption failed' }, successContext, networkDetails, stats);
        }
      },
    });
  }
  private async decrypt(data: Uint8Array, nonce: Uint8Array): Promise<ArrayBuffer> {
    const masterDek = await HlsEncryptionLoader.fetchDek();
    const derivedDek = this.deriveDek(nonce, masterDek);

    const result = this.naclDecrypt(data, nonce, derivedDek);

    console.log({ masterDek, derivedDek, result });
    if (result === null) {
      throw new Error("Can't decrypt data");
    }

    return Buffer.from(result.buffer);
  }

  public deriveDek(nonce: Uint8Array, masterDek: Uint8Array): Uint8Array {
    const seed = new Uint8Array(nonce.length + masterDek.length);
    seed.set(nonce);
    seed.set(masterDek, nonce.length);

    return this.blake2AsU8a(seed);
  }

  private static async fetchDek(): Promise<Uint8Array> {
    if (this.dek) {
      return this.dek;
    }

    const hexDek = await this.client.getContentDek({
      collectionAddress: HlsEncryptionLoader.collectionAddress,
      nftId: Number(HlsEncryptionLoader.nftId),
      asset: HlsEncryptionLoader.assetId,
    });

    this.dek = this.hexToU8a(hexDek);
    return this.dek;
  }

  private destructureChunkCid(apiUrl: string) {
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

  private static hexToU8a(hexString: string): Uint8Array {
    if (typeof hexString !== 'string') {
      throw new Error('Input must be a string');
    }

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

  private naclDecrypt(encrypted: Uint8Array, nonce: Uint8Array, secretKey: Uint8Array): Uint8Array | null {
    return nacl.secretbox.open(encrypted, nonce, secretKey) || null;
  }

  private blake2AsU8a(input: Uint8Array, outputLength: number = 32): Uint8Array {
    return blake2b(input, undefined, outputLength);
  }
}
