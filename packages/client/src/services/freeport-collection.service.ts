import { createFreeportCollection, createProvider } from '@cere/freeport-sc-sdk';
import axios from 'axios';
import { Signer, providers } from 'ethers';

import { networkConfig, NftMetadata, nftMetadataSchema, NftAsset } from '..';
import { FreeportCollectionOptions } from '../types/freeport-collection';

import { Logger } from './logger.service';

export const defaultFreeportCollectionOptions: FreeportCollectionOptions = {
  deployment: 'development',
  tenant: 'cerefans',
  logger: false,
};

export class FreeportCollectionService {
  private logger: Logger;

  protected constructor(
    private readonly signer: Signer,
    private readonly provider: providers.JsonRpcProvider,
    private readonly options: FreeportCollectionOptions,
  ) {
    this.logger = Logger('FreeportCollection', options.logger);
    this.logger.debug('FreeportApi initialized');
  }

  static async create(signer: Signer, options: FreeportCollectionOptions = defaultFreeportCollectionOptions) {
    const provider = createProvider(networkConfig[options.deployment]);
    const client = new FreeportCollectionService(signer, provider, options);

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

  private static async validateNetwork(signer: Signer, provider: providers.JsonRpcProvider) {
    const signerNetwork = await signer.provider?.getNetwork();
    const providerNetwork = provider.network;
    if (signerNetwork?.chainId !== providerNetwork.chainId) {
      throw new Error(
        `Signer and provider are connected to different networks. Signer: ${signerNetwork?.chainId}, provider: ${providerNetwork.chainId}`,
      );
    }
  }
}
