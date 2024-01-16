# Cere Media SDK for JavaScript

The Media SDK is a development kit that can be used to upload and retrieve encrypted content for Freeport Collection NFTs

## Packages

- [@cere-media-sdk/client](packages/client/README.md) - The entrypoint for interaction with the Freeport API to query tokens and their associated assets
- 
## Demo

The playground app is small demo application you can try how DDC SDK works in browser.

- [Source code](playground)
- [Online demo](https://cerebellum-network.github.io/cere-ddc-sdk-js/)

## Quick start

1. Prepare Node.JS version

   ```
   nvm use
   ```

2. Install dependencies:

   ```bash
   npm i
   ```

3. Build all packages and Playground app:

   ```bash
   npm run build
   ```

4. Run playground application:

   ```bash
   npm run playground
   ```
   Out of the box the playground app can connect to DDC `Devnet` and `Testnet`. To connect it to local environment, the environment [should be started](#local-environment) in a separate terminal.

## Tests

Run tests

```bash
npm test
```

On the first run it will take some time to prepare the local testing environment