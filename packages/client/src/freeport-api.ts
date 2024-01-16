import axios, { AxiosInstance } from 'axios';
import { Signer } from 'ethers';

import { mediaClientConfig } from './config';
import { Logger } from './logger';
import {
  AuthHeaders,
  FreeportApiClientOptions,
  GetByAddressRequest,
  GetCollectionsResponse,
  GetNftsResponse,
  getAuthMessageResponseSchema,
  getByAddressRequestSchema,
  getCollectionsResponseSchema,
  getNftsResponseSchema,
} from './types';

export const defaultFreeportApiOptions: FreeportApiClientOptions = {
  logger: false,
  freeportApiUrl: mediaClientConfig.development.davinci.freeportApiUrl,
  skipInitialHealthCheck: false,
};

export class FreeportApi {
  private logger: Logger;

  public instance!: AxiosInstance;

  private authHeaders?: AuthHeaders;

  constructor(options: FreeportApiClientOptions) {
    this.logger = Logger('FreeportApi', options.logger);
    this.logger.debug('FreeportApi initialized');
  }

  static async create(options: FreeportApiClientOptions = defaultFreeportApiOptions): Promise<FreeportApi> {
    const client = new FreeportApi(options);
    client.instance = axios.create({
      baseURL: options.freeportApiUrl,
      timeout: 10000,
    });
    client.authHeaders = undefined;
    if (!options.skipInitialHealthCheck) {
      await client.healthCheck();
    }
    return client;
  }

  public async healthCheck(): Promise<void> {
    const response = await this.instance.get('api/health-check');
    if (response.status !== 200 || response.data !== 'OK') {
      throw new Error('FreeportApi health check failed');
    }
  }

  /**
   * Generate valid auth headers for the Freeport API
   * @param signer The signer to use to sign the auth message
   */
  public async authenticate(signer: Signer): Promise<void> {
    const address = await signer.getAddress();
    const message = await this.getAuthMessage({ address });
    const signature = await signer.signMessage(message);

    this.authHeaders = {
      'x-message': message,
      'x-signature': signature,
      'x-public-key': address,
    };

    Object.assign(this.instance.defaults.headers, this.authHeaders);
    this.logger.debug('FreeportApi authenticated');
  }

  /**
   * Disconnect from the Freeport API
   * This will clear the auth headers but will not destroy the instance
   */
  public disconnect(): void {
    this.authHeaders = undefined;
  }

  /**
   * Request an auth message from the Freeport API
   * @param request.address The address to request an auth message for
   * @returns The time encoded auth message
   */
  public async getAuthMessage(request: GetByAddressRequest): Promise<string> {
    const { address } = getByAddressRequestSchema.parse(request);
    const response = await this.instance
      .get(`/api/wallet-auth/auth-message?walletPublicKey=${address}`)
      .then((res) => res.data)
      .then(getAuthMessageResponseSchema.parse);
    return response;
  }

  /**
   * Get all of the collections for a given address
   * @param request.address The address to get collections for
   * @returns The collections deployed by the given address
   */
  public async getCollections(request: GetByAddressRequest): Promise<GetCollectionsResponse> {
    const { address } = getByAddressRequestSchema.parse(request);
    return this.instance
      .get(`/api/wallet/${address}/collections`)
      .then((res) => res.data)
      .then(getCollectionsResponseSchema.parse);
  }

  /**
   * Get all of the NFTs owned by a given address
   * @param request.address The address to get NFTs for
   * @returns The NFTs owned by the given address
   */
  public async getOwnedNfts(request: GetByAddressRequest): Promise<GetNftsResponse> {
    const { address } = getByAddressRequestSchema.parse(request);
    return this.instance
      .get(`/api/wallet/${address}/owned`)
      .then((res) => res.data)
      .then(getNftsResponseSchema.parse);
  }

  /**
   * Get all of the NFTs minted by a given address
   * @param request.address The address to get NFTs for
   * @returns The NFTs minted by the given address
   */
  public async getMintedNfts(request: GetByAddressRequest): Promise<GetNftsResponse> {
    const { address } = getByAddressRequestSchema.parse(request);
    return this.instance
      .get(`/api/wallet/${address}/minted`)
      .then((res) => res.data)
      .then(getNftsResponseSchema.parse);
  }
}
