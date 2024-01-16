import { mediaClientConfig } from './config';
import { Logger } from './logger';
import axios, { AxiosInstance } from 'axios';
import { FreeportApiClientOptions } from './types';

export const defaultFreeportApiOptions: FreeportApiClientOptions = {
  logger: false,
  freeportApiUrl: mediaClientConfig.development.freeportApiUrl,
};

export class FreeportApi {
  private logger: Logger;

  private instance!: AxiosInstance;

  protected constructor({ logger }: FreeportApiClientOptions) {
    this.logger = Logger('FreeportApi', logger);
  }

  static async create(options: FreeportApiClientOptions = defaultFreeportApiOptions): Promise<FreeportApi> {
    const client = new FreeportApi(options);
    client.instance = axios.create({
      baseURL: options.freeportApiUrl,
      timeout: 10000,
    });

    client.logger.debug('FreeportApi initialized');
    return client;
  }
}
