import { Deployment, MediaClientConfig, MediaClientOptions, mediaClientConfig } from '.';
import { Logger } from './logger';

export const defaultMediaClientOptions: MediaClientOptions = {
  deployment: 'development',
  logger: false,
};

export class MediaSdkClient {
  public deployment: Deployment;

  public config: MediaClientConfig;

  private logger: Logger;

  protected constructor({ deployment, logger }: MediaClientOptions = defaultMediaClientOptions) {
    this.deployment = deployment;
    this.config = mediaClientConfig[deployment];
    this.logger = Logger('MediaClient', logger);
    this.logger.debug('MediaClient initialized');
  }

  static async create(options: MediaClientOptions = defaultMediaClientOptions): Promise<MediaSdkClient> {
    return new MediaSdkClient(options);
  }
}
