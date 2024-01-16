import { Signer } from 'ethers';

import { FreeportApi } from './freeport-api';
import { Logger } from './logger';

import { Deployment, MediaClientConfig, MediaClientOptions, mediaClientConfig } from '.';

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

  protected constructor({ deployment, tenant, logger }: MediaClientOptions = defaultMediaClientOptions) {
    this.deployment = deployment;
    this.config = mediaClientConfig[deployment][tenant];
    this.logger = Logger('MediaClient', logger);
  }

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
}
