import { Signer } from 'ethers';

import { GetNftMetadataRequest } from './types/freeport-collection';

import {
  Deployment,
  FreeportApiService,
  FreeportCollectionService,
  GetByAddressRequest,
  GetCanAccessRequest,
  GetCollectionsResponse,
  GetContentDekRequest,
  GetContentDekResponse,
  GetContentRequest,
  GetContentResponse,
  GetNftsResponse,
  LoggerLike,
  Logger,
  MediaClientConfig,
  MediaClientOptions,
  NftAsset,
  NftMetadata,
  mediaClientConfig,
  GetStreamKeyRequest,
  GetStreamKeyResponse,
} from '.';

export const defaultMediaClientOptions: MediaClientOptions = {
  deployment: 'development',
  tenant: 'cerefans',
  logger: false,
};

export class MediaSdkClient {
  public deployment: Deployment;

  public config: MediaClientConfig;

  private logger: LoggerLike;

  private freeportApi!: FreeportApiService;

  private freeportCollection!: FreeportCollectionService;

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
    await this.initFreeportApi(client, signer, options);
    await this.initFreeportCollection(client, signer, options);
    client.logger.debug('MediaClient initialized');
    return client;
  }

  /**
   * Get collections for address
   * @param address - address to get collections for (defaults to signer address)
   * @returns collections - list of collections deployed by this account
   */
  async getCollections({ address }: Partial<GetByAddressRequest>): Promise<GetCollectionsResponse> {
    return this.freeportApi.getCollections({ address: address || (await this.signer.getAddress()) });
  }

  /**
   * Get minted nfts for address
   * @param address - address to get minted nfts for (defaults to signer address)
   * @returns nfts - list of nfts minted by this account
   */
  async getMintedNfts({ address }: Partial<GetByAddressRequest>): Promise<GetNftsResponse> {
    return this.freeportApi.getMintedNfts({ address: address || (await this.signer.getAddress()) });
  }

  /**
   * Get owned nfts for address
   * @param address - address to get owned nfts for (defaults to signer address)
   * @returns nfts - list of nfts owned by this account
   */
  async getOwnedNfts({ address }: Partial<GetByAddressRequest>): Promise<GetNftsResponse> {
    return this.freeportApi.getOwnedNfts({ address: address || (await this.signer.getAddress()) });
  }

  /**
   * Get the formatted NFT metadata for a token including the assets that are associated with it
   * @param contractAddress - address of the Freeport Collection smart contract
   * @param nftId - id of the nft on the Freeport Collection smart contract
   * @returns nftMetadata - formatted NFT metadata
   */
  async getNftMetadata({ contractAddress, nftId }: GetNftMetadataRequest): Promise<NftMetadata> {
    return this.freeportCollection.getNftMetadata(contractAddress, nftId);
  }

  /**
   * Get the assets for a token
   * @param contractAddress - address of the Freeport Collection smart contract
   * @param nftId - id of the nft on the Freeport Collection smart contract
   * @returns nftAssets - list of assets for the token
   */
  async getNftAssets({ contractAddress, nftId }: GetNftMetadataRequest): Promise<NftAsset[]> {
    return this.freeportCollection.getNftAssets(contractAddress, nftId);
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
   * @param request.collectionAddress The address of the collection to check
   * @param request.walletAddress The address of the wallet to check
   * @param request.asset The identifier for the asset to get the DEK for
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

  private static async initFreeportApi(client: MediaSdkClient, signer: Signer, options: MediaClientOptions) {
    client.freeportApi = await FreeportApiService.create({
      logger: options.logger,
      freeportApiUrl: client.config.freeportApiUrl,
    });
    await client.freeportApi.authenticate(signer);
  }

  private static async initFreeportCollection(client: MediaSdkClient, signer: Signer, options: MediaClientOptions) {
    client.freeportCollection = await FreeportCollectionService.create(signer, options);
  }
}
