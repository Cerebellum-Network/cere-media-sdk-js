# @cere/media-sdk-react

- [@cere/media-sdk-react](#ceremedia-sdk-react)
  - [Installation](#installation)
  - [Setting up the provider](#setting-up-the-provider)
    - [Example](#example)
    - [Accessing the client](#accessing-the-client)
    - [Creating a static instance](#creating-a-static-instance)
  - [Hooks](#hooks)
  - [Hooks Documentation](#hooks-documentation)
    - [`useCollections`](#usecollections)
    - [`useMintedNfts`](#usemintednfts)
    - [`useOwnedNfts`](#useownednfts)
    - [`useNftMetadata`](#usenftmetadata)
    - [`useEncryptedContent`](#useencryptedcontent)
    - [`useDownloadContent`](#usedownloadcontent)
  - [Components](#components)
    - [`ContentView`](#contentview)
    - [`VideoPlayer`](#videoplayer)

## Installation

Install the package, note that the `@cere/media-sdk-client` package is a required dependency

***NPM***

```bash
npm install @cere/media-sdk-client @cere/media-sdk-react --save
```

***Yarn***

```bash
yarn add @cere/media-sdk-client @cere/media-sdk-react
```

## Setting up the provider

A new provider instance can be created using the `MediaSdkClientProvider` context and wrapping your application. This will inject the provider into all of the useful hooks for querying data from the Media SDK.

***Arguments***

- `signer` - an [ethers](https://www.npmjs.com/package/ethers) compatible signer instance
- `options` - a config object to define the environment and tenant to connect to 
    - `deployment` - the deployed environment to connect to
    - `tenant` - the tenant to connect to

```ts
interface MediaClientOptions {
  deployment: Deployment;
  tenant: Tenant;
  logger?: boolean;
}

type Deployment = 'production' | 'staging' | 'development' | 'local';
type Tenant = 'davinci' | 'cerefans';
```

### Example

Wrap your application at the highest level (within your wallet provider) and pass in the ethers signer and SDK options to connect your instance

```tsx
const signer = // ethers signer instance
const options = { tenant: "davinci", deployment: "development" }

return (
  <MediaSdkClientProvider signer={signer} options={options}>
    // your application
  </MediaSdkClientProvider>
)
```

### Accessing the client 

From components within the provider, you can then use the `useMediaClient` hook to access the provided client. All hooks will used within the provider will automatically use this client as well

```ts
import { useMediaClient } from '@cere/media-sdk-react';

// default
const { client } = useMediaClient()

// With client status
const { client, error, isLoading } = useMediaClient()
```

### Creating a static instance

>*This method should only be used for connecting directly to the client and querying the API. This created client instance will not be connected to the `MediaSdkClientProvider`, and therefore most of the useful hooks will not work. For most use cases, see the above `MediaSdkClientProvider` implementation*

The `MediaSDKClient` instance can be instantiated in React using the `useStaticMediaClient` hook, and passing a connected ethers Signer. This is already used internally by the `MediaSdkClientProvider` so is likely not needed for most use cases.


***Arguments***

- `signer` - an [ethers](https://www.npmjs.com/package/ethers) compatible signer instance
- `options` - a config object to define the environment and tenant to connect to 
    - `deployment` - the deployed environment to connect to
    - `tenant` - the tenant to connect to

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
import { useStaticMediaClient } from '@cere/media-sdk-react';

const signer = // Get Signer from currently connected wallet

// With default options
const { client } = useStaticMediaClient(signer)

// With client status
const { client, error, isLoading } = useStaticMediaClient(signer)

// With config arguments
const { client } = useStaticMediaClient(signer, { deployment: "development", tenant: "davinci" })

// With logger enabled
const { client } = useStaticMediaClient(signer, { ...options, logger: true })
```

## Hooks

## Hooks Documentation

### `useCollections`

The `useCollections` hook is designed to fetch all Freeport Collections associated with a specific address.

**Parameters:**
- `address` (optional): The Ethereum address for which the collections are to be fetched.

**Returns:**
- `collections`: An array of collections associated with the given address. Defaults to an empty array if no collections are found or if an error occurs.
- `isLoading`: A boolean indicating whether the collection data is currently being loaded.
- Additional properties from the `useSWR` hook.

**Usage Example:**

```tsx
import { useCollections } from '@cere/media-sdk-react';

const { collections, isLoading } = useCollections('0x123...');

if (isLoading) return <div>Loading...</div>;
return <div>{collections.map(/* render collections */)}</div>;
```

### `useMintedNfts`

Retrieves all of the Freeport NFTs minted by a specific address.


**Parameters:**

- `address` (optional): The address to get the minted NFTs for.

**Returns:**

- `mintedNfts`: An array of NFTs minted by the given address. Defaults to an empty array if no NFTs are found or if an error occurs.
- `isLoading`: A boolean indicating whether the minted NFTs are currently being loaded.
Additional properties from the useSWR hook.

**Usage Example:**

```tsx
import { useMintedNfts } from '@cere/media-sdk-react';

const { mintedNfts, isLoading } = useMintedNfts('0x456...');

if (isLoading) return <div>Loading...</div>;
return <div>{mintedNfts.map(/* render NFTs */)}</div>;
```

### `useOwnedNfts`

Fetches all of the Freeport NFTs owned by a specific address.


**Parameters:**

- `address` (optional): The address to get the owned NFTs for.

**Returns:**

- `ownedNfts`: An array of NFTs owned by the given address. Defaults to an empty array if no NFTs are found or if an error occurs.
- `isLoading`: A boolean indicating whether the owned NFTs are currently being loaded.
Additional properties from the useSWR hook.

**Usage Example:**

```tsx
import { useOwnedNfts } from '@cere/media-sdk-react';

const { ownedNfts, isLoading } = useOwnedNfts('0x789...');

if (isLoading) return <div>Loading...</div>;
return <div>{ownedNfts.map(/* render NFTs */)}</div>;
```

### `useNftMetadata`

Retrieves metadata for a specific Freeport NFT.

**Parameters:**

- `collectionAddress`: Address of the collection.
- `nftId`: ID of the NFT.

**Returns:**


- `metadata`: Metadata of the NFT.
- `isLoading`: Boolean indicating loading state.
- `Additional` properties from useSWR.

**Usage:**

```tsx
import { useNftMetadata } from '@cere/media-sdk-react';

const { metadata, isLoading } = useNftMetadata('0xABC...', 123);
// Render NFT metadata or loading state
```

### `useEncryptedContent`

Fetches and decrypts content for a given NFT and its metadata.

**Parameters:**

- `nft`: The NFT object.
- `metadata`: Metadata of the NFT.
- `assetIndex`: Index of the specific asset in the NFT's metadata.

**Returns:**

- `isVideo`: A boolean indicating if the content is a video.
- `content`: The decrypted content URL.
- `contentType`: The MIME type of the content.
- `asset`: The specific asset from the metadata.
- `isLoading`: A boolean indicating whether the content is currently being loaded.

**Usage Example:**

```tsx
import { useEncryptedContent } from '@cere/media-sdk-react';

const { isVideo, content, contentType, isLoading } = useEncryptedContent(nft, metadata, 0);

if (isLoading) return <div>Loading...</div>;
if (isVideo) {
  return <video src={content} type={contentType} />;
}
return <img src={content} alt="NFT Content" />;
```

### `useDownloadContent`

Downloads content and decrypts it

**Parameters:**

- `nft`: The NFT object.
- `asset`: An identifier for the asset in format `<"asset" | "preview">-<asset index>`

**Returns:**

- `download`: A function to download the file, taking an optional filename as a parameter
- `isLoading`: A boolean indicating whether the content is currently being loaded.

**Usage Example:**

```tsx
import { useDownloadContent } from '@cere/media-sdk-react';

const nft = { /* NFT data */ }

// For preview index 0
const { download, isLoading } = useDownloadContent(nft, "preview-0")
// For asset index 0
const { download, isLoading } = useDownloadContent(nft, "asset-0")
// For preview index 1
const { download, isLoading } = useDownloadContent(nft, "preview-1")
// For asset index 1
const { download, isLoading } = useDownloadContent(nft, "asset-1")

// For default preview
const { download, isLoading } = useDownloadContent(nft, "preview")
// For default asset
const { download, isLoading } = useDownloadContent(nft, "asset")

<Button onClick={() => download("some-file-name")} />
```

## Components

### `ContentView`

The ContentView component is designed to render media content associated with a specific NFT. It supports various media types like images, audio, and video. The component relies on the useMediaClient and useEncryptedContent hooks to fetch and display the content.

**Props**

- `nft` (NFT): The NFT for which the content is to be displayed.
- `metadata` (NftMetadata): Metadata associated with the NFT. This can be retrieved using the useNftMetadata hook.
- `assetIndex` (number): The index of the asset within the NFT's metadata for which content is to be viewed. Indexing starts at 0.


**Usage Example**

```tsx
const nft = // Get NFT using useMintedNfts() or useOwnedNfts()
const { metadata } = useNftMetadata(nft);

<ContentView nft={nft} metadata={metadata} assetIndex={0} />
```

**Behavior**

- Loading State: Displays a loading message when the content or client is loading.
- Image Content: If the asset's content type is an image (image/png, image/jpeg, image/gif), it renders an <img> element.
Audio Content: For audio content types (audio/mp4, audio/mpeg, audio/x-wav, audio/ogg), it renders an <audio> element with playback controls.
- Video Content: If the content is a video, it uses the VideoPlayer component for rendering.
- Error Handling: Logs an error and displays a message for unhandled media types.

### `VideoPlayer`

> This component is automatically used by the above `<ContentView />` component if the content is a video

The VideoPlayer component is a customizable video player designed for playing HLS (HTTP Live Streaming) video content. It uses Hls.js for HLS support and Plyr as the video player interface. It also supports client side encrypted video streaming from the DDC.

**Props**

- `src` (string): The source URL of the HLS video stream.
- `loader` (optional): A custom HLS segment loader. This can be used to modify how video segments are loaded, such as adding custom headers or implementing advanced caching mechanisms.

**Usage Example**

The `HlsEncryptionLoader` is available for client-side encrypted content streaming. This is automatically used for streaming encrypted content via the `<ContentView />` component. If the content is not encrypted, the loader is not needed.

*With HlsEncryptionLoader*
```tsx
const loader = HlsEncryptionLoader.create({
  collectionAddress: nft.collection.address,
  nftId: nft.nftId,
  assetId: `asset-${assetIndex}`,
  client,
})

<VideoPlayer src={/* encrypted asset url */} loader={loader} />
```

*With Server Side Decryption*
```tsx
const src = 'https://cdn.testnet.cere.network/49/baebb4iancdrt67gzjndihdqn4qpwin6majvly4xajvuu4bjb3mdhs4hsxi';
  const { url } = useServerSideUrl({
    src,
    nft: { /* NFT data */ }
  });


// Fetching the server side URL requires requesting a new stream key, so you must await this response
if (isLoading) {
  return "Loading..."
}

// This converts the CDN URL into a web URL to fetch and decrypt the content via the Freeport API
return <VideoPlayer src={url} />
```

*Without Loader*
```tsx
<VideoPlayer src={/* public asset url */}  />
```