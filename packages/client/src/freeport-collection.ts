import { createFreeportCollection, createProvider } from '@cere/freeport-sc-sdk';
import axios from 'axios';
import { Signer, providers } from 'ethers';

import { Logger } from './logger';
import { FreeportCollectionOptions } from './types/freeport-collection';

import { NftAsset, NftMetadata, networkConfig, nftMetadataSchema } from '.';

export const defaultFreeportCollectionOptions: FreeportCollectionOptions = {
  deployment: 'development',
  tenant: 'davinci',
  logger: false,
};

export class FreeportCollectionService {
  private logger: Logger;

  private options!: FreeportCollectionOptions;

  private signer!: Signer;

  private provider!: providers.JsonRpcProvider;

  protected constructor(signer: Signer, options: FreeportCollectionOptions) {
    this.provider = createProvider(networkConfig[options.deployment]);
    this.signer = signer.connect(this.provider);
    this.options = options;
    this.logger = Logger('FreeportCollection', options.logger);
    this.logger.debug('FreeportApi initialized');
  }

  static async create(signer: Signer, options: FreeportCollectionOptions = defaultFreeportCollectionOptions) {
    const client = new FreeportCollectionService(signer, options);

    return client;
  }

  async getNftMetadata(contractAddress: string, nftId: number): Promise<NftMetadata> {
    const freeportCollection = this.getFreeportCollection(contractAddress);
    const uri = await freeportCollection.uri(nftId);

    return axios
      .get(uri)
      .then((response) => response.data)
      .then(nftMetadataSchema.parse);
  }

  async getNftAssets(contractAddress: string, nftId: number): Promise<NftAsset[]> {
    const metadata = await this.getNftMetadata(contractAddress, nftId);
    return metadata.assets;
  }

  private getFreeportCollection(contractAddress: string) {
    return createFreeportCollection({ signer: this.signer, contractAddress });
  }
}
