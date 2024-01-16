import { Signer } from 'ethers';

import { FreeportApi } from './freeport-api';
import { Logger } from './logger';

import {
  Deployment,
  GetByAddressRequest,
  GetCollectionsResponse,
  GetNftsResponse,
  MediaClientConfig,
  MediaClientOptions,
  mediaClientConfig,
} from '.';

export const defaultMediaClientOptions: MediaClientOptions = {
  deployment: 'development',
  tenant: 'davinci',
  logger: false,
};

export class MediaSdkClient {
  public deployment: Deployment;

  public config: MediaClientConfig;

  private logger: Logger;

  private freeportApi!: FreeportApi;

  private signer!: Signer;

  protected constructor({ deployment, tenant, logger }: MediaClientOptions = defaultMediaClientOptions) {
    this.deployment = deployment;
    this.config = mediaClientConfig[deployment][tenant];
    this.logger = Logger('MediaClient', logger);
  }

  /**
   * Create a new MediaClient instance
   * @param signer A signer to authenticate with the Freeport API
   * @param options Options to configure the MediaClient
   * @returns MediaClient instance
   */
  static async create(
    signer: Signer,
    options: MediaClientOptions = defaultMediaClientOptions,
  ): Promise<MediaSdkClient> {
    const client = new MediaSdkClient(options);
    client.freeportApi = await FreeportApi.create({
      logger: options.logger,
      freeportApiUrl: client.config.freeportApiUrl,
    });
    await client.freeportApi.authenticate(signer);

    client.logger.debug('MediaClient initialized');
    return client;
  }

  /**
   * Get collections for address
   * @param request.address - address to get collections for (defaults to signer address)
   * @returns collections - list of collections deployed by this account
   */
  async getCollections(request: Partial<GetByAddressRequest>): Promise<GetCollectionsResponse> {
    const address = request.address || (await this.signer.getAddress());
    return this.freeportApi.getCollections({ address });
  }

  /**
   * Get minted nfts for address
   * @param request.address - address to get minted nfts for (defaults to signer address)
   * @returns nfts - list of nfts minted by this account
   */
  async getMintedNfts(request: Partial<GetByAddressRequest>): Promise<GetNftsResponse> {
    const address = request.address || (await this.signer.getAddress());
    return this.freeportApi.getMintedNfts({ address });
  }

  /**
   * Get owned nfts for address
   * @param request - address to get owned nfts for (defaults to signer address)
   * @returns nfts - list of nfts owned by this account
   */
  async getOwnedNfts(request: Partial<GetByAddressRequest>): Promise<GetNftsResponse> {
    const address = request.address || (await this.signer.getAddress());
    return this.freeportApi.getOwnedNfts({ address });
  }
}
