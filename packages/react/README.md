# @cere-media-sdk/react

- [@cere-media-sdk/react](#cere-media-sdkreact)
  - [Installation](#installation)
  - [Create an instance](#create-an-instance)

## Installation

Install the package:

***NPM***

```bash
npm install @cere-media-sdk/react --save
```

***Yarn***

```bash
yarn add @cere-media-sdk/react
```

## Create an instance

The `MediaSDKClient` instance can be instantiated in React using the `useMediaClient` hook, and passing a connected ethers Signer


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
import { useMediaClient } from '@cere-media-sdk/react';

const signer = // Get Signer from currently connected wallet

// With default options
const { client } = useMediaClient(signer)

// With client status
const { client, error, isLoading } = useMediaClient(signer)

// With config arguments
const { client } = useMediaClient(signer, { deployment: "development", tenant: "davinci" })

// With logger enabled
const { client } = useMediaClient(signer, { ...options, logger: true })
```