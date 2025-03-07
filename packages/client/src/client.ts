import { Signer } from 'ethers';

import { ChainNamespace, NftMetadata } from './types';
import { GetNftMetadataRequest } from './types/freeport-collection';

import {
  Deployment,
  FreeportApiService,
  GetCanAccessRequest,
  GetContentDekRequest,
  GetContentDekResponse,
  GetContentRequest,
  GetContentResponse,
  LoggerLike,
  Logger,
  MediaClientConfig,
  MediaClientOptions,
  mediaClientConfig,
  GetStreamKeyRequest,
  GetStreamKeyResponse,
} from '.';

export const defaultMediaClientOptions: MediaClientOptions = {
  deployment: 'development',
  tenant: 'davinci',
  logger: false,
};

export class MediaSdkClient {
  public deployment: Deployment;

  public config: MediaClientConfig;

  private logger: LoggerLike;

  private freeportApi!: FreeportApiService;

  protected constructor({ deployment, tenant, logger }: MediaClientOptions = defaultMediaClientOptions) {
    this.deployment = deployment;
    this.config = mediaClientConfig[deployment][tenant];
    this.logger = Logger('MediaClient', logger);
  }

  /**
   * Create a new MediaClient instance
   * @param chainId To specify network chain id
   * @param chainNamespace To specify network
   * @param signer A signer to authenticate with the Freeport API
   * @param options Options to configure the MediaClient
   * @returns MediaClient instance
   */
  static async create(
    chainId: string,
    chainNamespace: ChainNamespace,
    signer: Signer,
    options: MediaClientOptions = defaultMediaClientOptions,
  ): Promise<MediaSdkClient> {
    const client = new MediaSdkClient(options);
    await this.initFreeportApi(signer, client, chainId, chainNamespace, options);
    client.logger.debug('MediaClient initialized');
    return client;
  }

  /**
   * Check if a wallet has access to an NFT's content
   * @param contractAddress - address of the Freeport Collection smart contract
   * @param nftId - id of the nft on the Freeport Collection smart contract
   * @param address - address to check access for (defaults to signer address)
   * @returns true if the given wallet address can access the given NFT, false otherwise
   */
  async getCanAccess({ collectionAddress, nftId, walletAddress }: GetCanAccessRequest): Promise<boolean> {
    return this.freeportApi.getCanAccess({ collectionAddress, nftId, walletAddress });
  }

  /**
   * Get the DEK for a given NFT's content
   * @param request.collectionAddress The address of the collection to check
   * @param request.walletAddress The address of the wallet to check
   * @param request.asset The identifier for the asset to get the DEK for
   * @returns The DEK for the given NFT's content
   */
  async getContentDek({ collectionAddress, nftId, asset }: GetContentDekRequest): Promise<GetContentDekResponse> {
    return this.freeportApi.getContentDek({ collectionAddress, nftId, asset });
  }

  /**
   * Get decrypted content for a given NFT
   * @param collectionAddress The address of the collection to check
   * @param nftId - id of the nft on the Freeport Collection smart contract
   * @param asset The identifier for the asset to get the DEK for
   * @returns The decrypted content for the given NFT
   */
  public async getContent({ collectionAddress, nftId, asset }: GetContentRequest): Promise<GetContentResponse> {
    return this.freeportApi.getContent({ collectionAddress, nftId, asset });
  }

  /**
   * Get a stream key to run server side decryption on an encrypted asset
   * @param request.collectionAddress The address of the collection to check
   * @param request.nftId The ID of the NFT to check
   * @param request.bucketId The ID of the bucket to check
   * @param request.cid The CID of the content to check
   * @returns The encrypted stream key for the given asset
   */
  public async getStreamKey({
    collectionAddress,
    nftId,
    bucketId,
    cid,
  }: GetStreamKeyRequest): Promise<GetStreamKeyResponse> {
    return this.freeportApi.getStreamKey({ collectionAddress, nftId, bucketId, cid });
  }

  /**
   * Get the formatted NFT metadata for a token including the assets that are associated with it
   * @param contractAddress - address of the Freeport Collection smart contract
   * @param nftId - id of the nft on the Freeport Collection smart contract
   * @returns nftMetadata - formatted NFT metadata
   */
  public async getNftMetadata({ contractAddress, nftId }: GetNftMetadataRequest): Promise<NftMetadata> {
    return this.freeportApi.getNftMetadata(contractAddress, nftId);
  }

  private static async initFreeportApi(
    signer: Signer,
    client: MediaSdkClient,
    chainId: string,
    chainNamespace: ChainNamespace,
    options: MediaClientOptions,
  ) {
    client.freeportApi = await FreeportApiService.create({
      chainId,
      chainNamespace,
      logger: options.logger,
      freeportApiUrl: client.config.freeportApiUrl,
      signer,
    });
    await client.freeportApi.authenticate(signer);
  }
}
