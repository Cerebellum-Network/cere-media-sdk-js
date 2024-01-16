import axios, { AxiosInstance } from 'axios';
import { Signer } from 'ethers';

import { mediaClientConfig } from './config';
import { Logger } from './logger';
import {
  AuthHeaders,
  FreeportApiClientOptions,
  GetAuthMessageRequest,
  getAuthMessageRequestSchema,
  getAuthMessageResponseSchema,
} from './types';

export const defaultFreeportApiOptions: FreeportApiClientOptions = {
  logger: false,
  freeportApiUrl: mediaClientConfig.development.freeportApiUrl,
  skipInitialHealthCheck: false,
};

export class FreeportApi {
  private static logger: Logger;

  public static instance: AxiosInstance;

  private static authHeaders?: AuthHeaders;

  static async create(options: FreeportApiClientOptions = defaultFreeportApiOptions): Promise<FreeportApi> {
    this.instance = axios.create({
      baseURL: options.freeportApiUrl,
      timeout: 10000,
    });
    this.authHeaders = undefined;
    if (!options.skipInitialHealthCheck) {
      await this.healthCheck();
    }

    this.logger = Logger('FreeportApi', options.logger);
    this.logger.debug('FreeportApi initialized');
    return this;
  }

  public static async healthCheck(): Promise<void> {
    const response = await this.instance.get('api/health-check');
    if (response.status !== 200 || response.data !== 'OK') {
      throw new Error('FreeportApi health check failed');
    }
  }

  /**
   * Generate valid auth headers for the Freeport API
   * @param signer The signer to use to sign the auth message
   */
  public static async authenticate(signer: Signer): Promise<void> {
    const address = await signer.getAddress();
    const message = await this.getAuthMessage({ address });
    const signature = await signer.signMessage(message);

    this.authHeaders = {
      'x-message': message,
      'x-signature': signature,
      'x-public-key': address,
    };
  }

  /**
   * Disconnect from the Freeport API
   * This will clear the auth headers but will not destroy the instance
   */
  public static disconnect(): void {
    this.authHeaders = undefined;
  }

  /**
   * Request an auth message from the Freeport API
   * @param address The address to request an auth message for
   * @returns The time encoded auth message
   */
  public static async getAuthMessage(request: GetAuthMessageRequest): Promise<string> {
    const { address } = getAuthMessageRequestSchema.parse(request);
    const response = await this.instance
      .get(`/api/wallet-auth/auth-message?walletPublicKey=${address}`)
      .then((res) => res.data)
      .then(getAuthMessageResponseSchema.parse);
    return response;
  }
}
