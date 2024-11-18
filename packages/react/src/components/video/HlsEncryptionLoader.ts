import * as crypto from 'crypto-js';
import type { LoaderCallbacks, LoaderConfiguration, LoaderContext, LoaderResponse, LoaderStats } from 'hls.js';
import { Loader, HlsConfig } from 'hls.js';
import nacl from 'tweetnacl';

interface EncryptionConfig {
  dek: string;
  loaderInstance: {
    new (confg: HlsConfig): Loader<LoaderContext>;
  };
}

const nonce = new Uint8Array();

export const createHlsEncryptionLoader = async (config: EncryptionConfig) => {
  const hlsModule = await import('hls.js');
  const Hls = hlsModule.default;

  const { dek, loaderInstance } = config;
  const loaderInstanceToDecorate = loaderInstance || Hls.DefaultConfig.loader;

  function decrypt(encrypted: string, secretKey: string): string {
    return crypto.AES.decrypt(encrypted, secretKey).toString(crypto.enc.Utf8);
  }

  return class extends loaderInstanceToDecorate {
    load(context: LoaderContext, config: LoaderConfiguration, callbacks: LoaderCallbacks<LoaderContext>) {
      super.load(context, config, {
        ...callbacks,
        onSuccess: async (
          response: LoaderResponse,
          stats: LoaderStats,
          successContext: LoaderContext,
          networkDetails: unknown,
        ) => {
          try {
            const isManifest = typeof response.data === 'string';
            const encrypted = Buffer.from(response.data as ArrayBuffer);

            const decrypted = decrypt(new TextDecoder().decode(encrypted), dek);
            console.log('DECRYPTED');
            console.log(decrypted);
            if (isManifest) {
              response.data = decrypted;
            } else {
              response.data = Buffer.from(decrypted);
            }
            console.log(response.data);
            callbacks.onSuccess(response, stats, successContext, networkDetails);
            console.log('On HLS ENC success called');
          } catch (error) {
            console.log('Decryption failed: ' + error);
            callbacks.onError({ code: -1, text: 'Decryption failed' }, successContext, networkDetails, stats);
          }
        },
      });
    }
  };
};
