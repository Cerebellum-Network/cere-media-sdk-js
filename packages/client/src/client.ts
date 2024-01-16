import { Deployment, MediaClientConfig, MediaClientOptions, mediaClientConfig } from '.';
import { FreeportApi } from './freeport-api';
import { Logger } from './logger';

export const defaultMediaClientOptions: MediaClientOptions = {
  deployment: 'development',
  logger: false,
};

export class MediaSdkClient {
  public deployment: Deployment;

  public config: MediaClientConfig;

  private logger: Logger;

  private freeportApi!: FreeportApi;

  protected constructor({ deployment, logger }: MediaClientOptions = defaultMediaClientOptions) {
    this.deployment = deployment;
    this.config = mediaClientConfig[deployment];
    this.logger = Logger('MediaClient', logger);
  }

  static async create(options: MediaClientOptions = defaultMediaClientOptions): Promise<MediaSdkClient> {
    const client = new MediaSdkClient(options);
    client.freeportApi = await FreeportApi.create({
      logger: options.logger,
      freeportApiUrl: client.config.freeportApiUrl,
    });

    client.logger.debug('MediaClient initialized');
    return client;
  }
}
