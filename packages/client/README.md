# @cere/media-sdk-client

- [@cere/media-sdk-client](#cere-media-sdkclient)
  - [Installation](#installation)
  - [Create an instance](#create-an-instance)
  - [API](#api)
    - [create()](#create)
    - [getCollection()](#getcollection)
    - [getMintedNfts()](#getmintednfts)
    - [getOwnedNfts()](#getownednfts)
    - [getNftMetadata()](#getnftmetadata)
    - [getNftAssets()](#getnftassets)
    - [getCanAccess()](#getcanaccess)
    - [getContentDek()](#getcontentdek)
    - [getContent()](#getcontent)

## Installation

Install the package:

***NPM***

```bash
npm install @cere/media-sdk-client --save
```

***Yarn***

```bash
yarn add @cere/media-sdk-client
```

## Create an instance

The `MediaSdkClient` instance can be created using the static `create` method. It takes two arguments

***Arguments***

- `signer` - an [ethers](https://www.npmjs.com/package/ethers) compatible signer instance
- `options` - a config object to define the environment and tenant to connect to 
    - `deployment` - the deployed environment to connect to
    - `tenant` - the tenant to connect to
- `logger` - whether to enable debug logging for the client

```ts
interface MediaClientOptions {
  deployment: Deployment;
  tenant: Tenant;
  logger?: boolean;
}

type Deployment = 'production' | 'staging' | 'development' | 'local';
type Tenant = 'davinci' | 'cerefans';
```

***Example***

```ts
import { MediaClientOptions } from '@cere/media-sdk-client';

const signer = // Get Signer from currently connected wallet

// With default options
const client = await MediaSdkClient.create(signer)

// With config arguments
const client = await MediaSdkClient.create({ deployment: "development", tenant: "davinci" })

// With logger enabled
const client = await MediaSdkClient.create({ ...options, logger: true })
```

## API

The methods provided by the `MediaSdkClient` are:

### `create()`

Creates and initializes a new instance of MediaSdkClient.

***Arguments:***

- signer (Signer): An ethers compatible signer instance for authentication.
- options (MediaClientOptions): Configuration options including deployment, tenant, and logger settings.

***Returns:*** 

MediaSdkClient - A promise that resolves to a new instance of MediaSdkClient.

### `getCollection()`

Retrieves a list of collections associated with a specified Ethereum address.

*Arguments:*

- address (string): The Ethereum address to get collections for.

***Returns:***

GetCollectionsResponse - An array of Collection objects, each containing details like id, address, uri, name, and tenant.

### `getMintedNfts()`


Fetches a list of NFTs minted by a specified Ethereum address.

***Arguments:***

- address (string): The Ethereum address to get minted NFTs for.
 
***Returns:***

GetNftsResponse - An array of NFT objects, each detailing the minted NFTs including id, nftId, supply, and collection information.

### `getOwnedNfts()`

Retrieves NFTs currently owned by a specified Ethereum address.

***Arguments:***

address (string): The Ethereum address to get owned NFTs for.

***Returns:***

 GetNftsResponse - An array of NFT objects similar to the getMintedNfts response, detailing the NFTs owned.

### `getNftMetadata()`

Gets detailed metadata for a specific NFT.

***Arguments:***

- contractAddress (string): The contract address of the NFT collection.
- nftId (number): The ID of the NFT within the collection.

***Returns:*** 

NftMetadata - An object containing NFT details like name, description, preview, and associated assets.

### `getNftAssets()`

Retrieves assets associated with a specific NFT.

***Arguments:***

- contractAddress (string): The contract address of the NFT collection.
- nftId (number): The ID of the NFT within the collection.

***Returns:*** 

NftAsset[] - An array of NftAsset objects, each detailing an asset associated with the NFT including name, description, asset link, preview link, and content type.

### `getCanAccess()`

Checks if a wallet has access to an NFT's content.

***Arguments:***

- collectionAddress (string): The address of the Freeport Collection smart contract.
- nftId (number): The ID of the NFT on the Freeport Collection smart contract.
- walletAddress (string): The address to check access for. Defaults to the signer's address if not specified.

***Returns:***

boolean - Returns true if the given wallet address can access the given NFT, false otherwise.

### `getContentDek()`

Retrieves the Data Encryption Key (DEK) for a given NFT's content.

***Arguments:***

- collectionAddress (string): The address of the collection containing the NFT.
- nftId (number): The ID of the NFT within the collection.
- asset (string): The identifier for the asset to get the DEK for.
  
***Returns:***

GetContentDekResponse (string) - The DEK for the given NFT's content.

### `getContent()`

Gets the decrypted content for a given NFT.

***Arguments:***

- collectionAddress (string): The address of the collection containing the NFT.
- walletAddress (string): The address of the wallet holding the NFT.
- asset (string): The identifier for the asset to get the content for.
  
***Returns:***

GetContentResponse (Blob) - The decrypted content for the given NFT.

