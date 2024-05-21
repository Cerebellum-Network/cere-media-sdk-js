import axios, { AxiosInstance } from 'axios';
import { Signer } from 'ethers';
import { getAddress } from 'ethers/lib/utils';

import { mediaClientConfig } from '../config';
import {
  AuthHeaders,
  FreeportApiClientOptions,
  GetByAddressRequest,
  GetCanAccessRequest,
  GetCanAccessResponse,
  GetCollectionsResponse,
  GetContentDekRequest,
  GetContentDekResponse,
  GetContentRequest,
  GetContentResponse,
  GetNftsResponse,
  GetStreamKeyRequest,
  GetStreamKeyResponse,
  getAuthMessageResponseSchema,
  getByAddressRequestSchema,
  getCanAccessRequestSchema,
  getCanAccessResponseSchema,
  getCollectionsResponseSchema,
  getContentDekRequest,
  getContentDekResponse,
  getContentRequest,
  getNftsResponseSchema,
  getStreamKeyRequest,
} from '../types';

import { LoggerLike, Logger, handleDebug, handleError } from './logger.service';

import {
  WalletCredentials,
  clearCachedCredentials,
  getCachedCredentials,
  hoursToMilliseconds,
  setCachedCredentials,
} from '.';

export const defaultFreeportApiOptions: FreeportApiClientOptions = {
  logger: false,
  freeportApiUrl: mediaClientConfig.development.davinci.freeportApiUrl,
  skipInitialHealthCheck: false,
};

export class FreeportApiService {
  private logger: LoggerLike;

  public instance!: AxiosInstance;

  private authHeaders?: AuthHeaders;

  constructor(options: FreeportApiClientOptions) {
    this.logger = Logger('FreeportApi', options.logger);
    this.logger.debug('FreeportApi initialized');
  }

  static async create(options: FreeportApiClientOptions = defaultFreeportApiOptions): Promise<FreeportApiService> {
    const client = new FreeportApiService(options);
    client.instance = axios.create({ baseURL: options.freeportApiUrl });
    client.authHeaders = undefined;
    if (!options.skipInitialHealthCheck) {
      await client.healthCheck();
    }
    return client;
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
    const credentialCache = getCachedCredentials();
    // @ts-ignore
    const accounts = await signer.provider?.provider?.request({ method: 'solana_accounts' });

    const message = await this.getAuthMessage({ address: accounts[0] });

    if (credentialCache) {
      if (getAddress(credentialCache['x-public-key']) !== getAddress(address)) {
        // Accounts have changed since the last time credentials were generated
        clearCachedCredentials();
        this.logger.debug('Cached credentials do not match signer address');
      } else {
        // 1 hour expiry on credentials has passed
        const newTime = message.split(' ').pop();
        const cachedTime = credentialCache['x-message'].split(' ').pop();
        if (Number(newTime) - Number(cachedTime) < hoursToMilliseconds(1)) {
          this.logger.debug('Using cached credentials');
          this.authHeaders = credentialCache;
          Object.assign(this.instance.defaults.headers, this.authHeaders);
          return;
        }
        this.logger.debug('Cached credentials have expired');
      }
    }

    this.logger.debug('Awaiting signature');
    // @ts-ignore
    const signature = await signer.provider?.provider?.request({
      method: 'solana_signMessage',
      params: [null, message],
    });

    const credentials: WalletCredentials = {
      'x-message': message,
      'x-signature': signature,
      'x-public-key': accounts[0],
    };
    this.logger.debug('Authentication message signed', { credentials });

    this.authHeaders = credentials;
    setCachedCredentials(credentials);
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
    const response = await this.instance
      .get(`/api/wallet-auth/auth-message?walletPublicKey=${address}`)
      .then((res) => res.data)
      .then(getAuthMessageResponseSchema.parse)
      .then(handleDebug(this.logger, `Get Auth Message for ${address}`))
      .catch(handleError(this.logger));

    return response;
  }

  /**
   * Get all of the collections for a given address
   * @param request.address The address to get collections for
   * @returns The collections deployed by the given address
   */
  public async getCollections(request: GetByAddressRequest): Promise<GetCollectionsResponse> {
    const { address } = getByAddressRequestSchema.parse(request);
    return this.instance
      .get(`/api/wallet/${address}/collections`)
      .then((res) => res.data)
      .then(getCollectionsResponseSchema.parse)
      .then(handleDebug(this.logger, `Get Collections for ${address}`))
      .catch(handleError(this.logger));
  }

  /**
   * Get all of the NFTs owned by a given address
   * @param request.address The address to get NFTs for
   * @returns The NFTs owned by the given address
   */
  public async getOwnedNfts(request: GetByAddressRequest): Promise<GetNftsResponse> {
    const { address } = getByAddressRequestSchema.parse(request);
    return this.instance
      .get(`/api/wallet/${address}/owned`)
      .then((res) => res.data)
      .then(getNftsResponseSchema.parse)
      .then(handleDebug(this.logger, `Get Owned NFTs for ${address}`))
      .catch(handleError(this.logger));
  }

  /**
   * Get all of the NFTs minted by a given address
   * @param request.address The address to get NFTs for
   * @returns The NFTs minted by the given address
   */
  public async getMintedNfts(request: GetByAddressRequest): Promise<GetNftsResponse> {
    const { address } = getByAddressRequestSchema.parse(request);
    return this.instance
      .get(`/api/wallet/${address}/minted`)
      .then((res) => res.data)
      .then(getNftsResponseSchema.parse)
      .then(handleDebug(this.logger, `Get Minted NFTs for ${address}`))
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
}
