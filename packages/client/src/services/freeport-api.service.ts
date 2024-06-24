import axios, { AxiosInstance } from 'axios';
import { Signer } from 'ethers';

import { mediaClientConfig } from '../config';
import {
  AuthHeaders,
  ChainHeaders,
  ChainNamespace,
  FreeportApiClientOptions,
  getAuthMessageResponseSchema,
  GetByAddressRequest,
  getByAddressRequestSchema,
  GetCanAccessRequest,
  getCanAccessRequestSchema,
  GetCanAccessResponse,
  getCanAccessResponseSchema,
  GetContentDekRequest,
  getContentDekRequest,
  GetContentDekResponse,
  getContentDekResponse,
  GetContentRequest,
  getContentRequest,
  GetContentResponse,
  GetStreamKeyRequest,
  getStreamKeyRequest,
  GetStreamKeyResponse,
  NftMetadata,
} from '../types';

import { handleDebug, handleError, Logger, LoggerLike } from './logger.service';

export const defaultFreeportApiOptions: FreeportApiClientOptions = {
  chainId: '',
  chainNamespace: ChainNamespace.EIP155,
  logger: false,
  freeportApiUrl: mediaClientConfig.development.davinci.freeportApiUrl,
  skipInitialHealthCheck: false,
  signer: undefined,
};

export class FreeportApiService {
  private logger: LoggerLike;

  public instance!: AxiosInstance;

  private authHeaders?: AuthHeaders;

  private chainHeaders?: ChainHeaders;

  private signer?: Signer;

  private chainId: string;

  private chainNamespace: ChainNamespace;

  constructor(options: FreeportApiClientOptions) {
    this.chainId = options.chainId;
    this.chainNamespace = options.chainNamespace;
    this.logger = Logger('FreeportApi', options.logger);
    this.logger.debug('FreeportApi initialized');
    this.signer = options.signer;
  }

  static async create(options: FreeportApiClientOptions = defaultFreeportApiOptions): Promise<FreeportApiService> {
    const client = new FreeportApiService(options);
    client.instance = axios.create({ baseURL: options.freeportApiUrl });
    client.authHeaders = undefined;
    client.chainHeaders = undefined;
    client.signer = options.signer;
    client.prepareChainHeaders();
    if (!options.skipInitialHealthCheck) {
      await client.healthCheck();
    }
    return client;
  }

  prepareChainHeaders() {
    this.chainHeaders = {
      'chain-namespace': this.chainNamespace,
      'chain-id': this.chainId,
    };
    Object.assign(this.instance.defaults.headers, this.chainHeaders);
    this.logger.debug('Chain headers added');
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
    const address = await signer?.getAddress();
    const message = await this.getAuthMessage({ address });

    this.logger.debug('Awaiting signature');
    const signature = await signer.signMessage(message);

    const credentials: {
      ['x-message']: string;
      ['x-signature']: string;
      ['x-public-key']: string;
    } = {
      'x-message': message,
      'x-signature': signature,
      'x-public-key': address,
    };
    this.logger.debug('Authentication message signed', { credentials });

    this.authHeaders = credentials;
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
    return await this.instance
      .get(`/api/wallet-auth/auth-message?walletPublicKey=${address}`)
      .then((res) => res.data)
      .then(getAuthMessageResponseSchema.parse)
      .then(handleDebug(this.logger, `Get Auth Message for ${address}`))
      .catch(handleError(this.logger));
  }

  /**
   * Check if a wallet has access to an NFT's content
   * @param request.collectionAddress The address of the collection to check
   * @param request.walletAddress The address of the wallet to check
   * @param request.nftId The ID of the NFT to check
   * @returns true if the given wallet address can access the given NFT, false otherwise
   */
  public async getCanAccess(request: GetCanAccessRequest): Promise<GetCanAccessResponse> {
    const { collectionAddress, walletAddress, nftId } = getCanAccessRequestSchema.parse(request);
    return this.instance
      .get(`/api/content/${collectionAddress}/${nftId}/${walletAddress}/access`)
      .then((res) => res.data)
      .then(getCanAccessResponseSchema.parse)
      .then(handleDebug(this.logger, `Get Can Access for ${walletAddress}`))
      .catch(() => false);
  }

  /**
   * Get the DEK for a given NFT's content
   * @param request.collectionAddress The address of the collection to check
   * @param request.walletAddress The address of the wallet to check
   * @param request.asset The identifier for the asset to get the DEK for
   * @returns The DEK for the given NFT's content
   */
  public async getContentDek(request: GetContentDekRequest): Promise<GetContentDekResponse> {
    const { collectionAddress, nftId, asset } = getContentDekRequest.parse(request);
    return this.instance
      .get(`/api/content/${collectionAddress}/${nftId}/${asset}/dek`)
      .then((res) => res.data)
      .then(getContentDekResponse.parse)
      .then(handleDebug(this.logger, `Get Content DEK for ${collectionAddress}/${nftId}/${asset}`))
      .catch(handleError(this.logger));
  }

  /**
   * Get decrypted content for a given NFT
   * @param request.collectionAddress The address of the collection to check
   * @param request.walletAddress The address of the wallet to check
   * @param request.asset The identifier for the asset to get the DEK for
   * @returns The decrypted content for the given NFT
   */
  public async getContent(request: GetContentRequest): Promise<GetContentResponse> {
    const { collectionAddress, nftId, asset } = getContentRequest.parse(request);
    return this.instance
      .get(`/api/content/${collectionAddress}/${nftId}/${asset}`, { responseType: 'blob' })
      .then((res) => res.data)
      .then(handleDebug(this.logger, `Get Content for ${collectionAddress}/${nftId}/${asset}`))
      .catch(handleError(this.logger));
  }

  /**
   * Get the stream key for an encrypted server side video stream
   * @param request.collectionAddress The address of the collection to check
   * @param request.nftId The ID of the NFT to check
   * @param request.bucketId The ID of the bucket to check
   * @param request.cid The CID of the content to check
   * @returns The encrypted stream key for the given asset
   */
  public async getStreamKey(request: GetStreamKeyRequest): Promise<GetStreamKeyResponse> {
    const { collectionAddress, nftId, bucketId, cid } = getStreamKeyRequest.parse(request);
    return this.instance
      .get(`/api/video/streaming/${collectionAddress}/${nftId}/${bucketId}/${cid}/stream-key`)
      .then((res) => res.data)
      .then(handleDebug(this.logger, `Get Stream Key for ${collectionAddress}/${nftId}/${bucketId}/${cid}`))
      .catch(handleError(this.logger));
  }

  /**
   * Get the formatted NFT metadata for a token including the assets that are associated with it
   * @param contractAddress - address of the Freeport Collection smart contract
   * @param nftId - id of the nft on the Freeport Collection smart contract
   * @returns nftMetadata - formatted NFT metadata
   */
  public getNftMetadata(contractAddress: string, nftId: number): Promise<NftMetadata> {
    return this.instance
      .get(`/api/content/metadata/${contractAddress}/${nftId}`)
      .then((res) => res.data)
      .then(
        handleDebug(this.logger, `Get the formatted NFT metadata for /content/metadata/${contractAddress}/${nftId}`),
      )
      .catch(handleError(this.logger));
  }
}
