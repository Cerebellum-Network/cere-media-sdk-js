import { MediaSdkClient } from '@cere-media-sdk/client';
import { blake2b } from 'blakejs';
import Hls, { LoaderCallbacks, LoaderConfiguration, LoaderContext, LoaderResponse, LoaderStats } from 'hls.js';
import nacl from 'tweetnacl';

interface EncryptionConfig {
  collectionAddress: string;
  nftId: number;
  assetId: string;
  client: MediaSdkClient;
}

export class HlsEncryptionLoader extends Hls.DefaultConfig.loader {
  private static client: MediaSdkClient;

  public static collectionAddress: string;

  public static nftId: number;

  public static assetId: string;

  public static dek?: Uint8Array;

  public static create({ collectionAddress, nftId, assetId, client }: EncryptionConfig) {
    this.collectionAddress = collectionAddress;
    this.nftId = nftId;
    this.assetId = assetId;
    this.dek = undefined;
    this.client = client;

    return this;
  }

  load(context: LoaderContext, config: LoaderConfiguration, callbacks: LoaderCallbacks<LoaderContext>) {
    const { baseUrl, nonce, bucketId, cid, encrypted, isChunk } = this.destructureChunkCid(context.url);

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
          response.data = await this.decrypt(fetchedData, HlsEncryptionLoader.hexToU8a(nonce!));

          callbacks.onSuccess(response, stats, successContext, networkDetails);
        } catch (error) {
          console.log(error);
          callbacks.onError({ code: -1, text: 'Decryption failed' }, successContext, networkDetails, stats);
        }
      },
    });
  }

  /**
   * Decrypt a chunk of encrypted data using the nonce encoded in the playlist file and the master DEK associated with this video
   * @param data The encrypted data to be decrypted
   * @param nonce The nonce for the chunk to be decrypted. This is encoded in the chunk ID of the playlist file
   * @returns The decrypted chunk
   */
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

  /**
   * Derive a dek for the chunk from the master dek and the chunk nonce
   * @param nonce The nonce for the chunk to be decrypted. This is encoded in the chunk ID of the playlist file
   * @param masterDek The master DEK that was used to encrypt the file
   * @returns The derived DEK
   */
  public deriveDek(nonce: Uint8Array, masterDek: Uint8Array): Uint8Array {
    const seed = new Uint8Array(nonce.length + masterDek.length);
    seed.set(nonce);
    seed.set(masterDek, nonce.length);

    return this.blake2AsU8a(seed);
  }

  /**
   * Fetches the root dek that was used to encrypt this video, each chunk derives its own dek from this root dek
   */
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

  /**
   * When chunks are encrypted they have their encryption nonce prepended to the CID,
   * e.g chunk/enc_{{nonce}}_{{cid}}}
   * e.g chunk/enc_0x01decbcb3f8908d885b5a5663c8786f73c240dc4ed94df55_baebb4iddto7txzjtxwsmriyghknrrzhcnjroevdlngcmdllb7orluhl4wy
   * @param chunkCid Full encoded CID of the chunk pulled from the playlist file
   */
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

  //
  // The following helpers were recreated from the @polkadot/... packages as the current webpack config of the marketplace does not support using them directly
  // They directly use the tweetnacl and blakejs libraries
  //

  private static hexToU8a(hexString: string): Uint8Array {
    // Ensure the input is a string
    if (typeof hexString !== 'string') {
      throw new Error('Input must be a string');
    }

    // Remove the '0x' prefix if present
    hexString = hexString.startsWith('0x') ? hexString.slice(2) : hexString;

    // Ensure the string length is even
    if (hexString.length % 2 !== 0) {
      console.warn('Hex string has an odd number of characters, adding a leading zero.');
      hexString = '0' + hexString;
    }

    // Convert the hexadecimal string to a Uint8Array
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
