# Cere Media SDK for JavaScript

The Media SDK is a development kit that can be used to upload and retrieve encrypted content for Freeport Collection NFTs

## Packages

- [@cere/media-sdk-client](packages/client/README.md) - The entrypoint for interaction with the Freeport API to query tokens and their associated assets

## Demo

The playground app is small demo application to try using the Media SDK

- [Source code](playground)
- [Online demo](https://cerebellum-network.github.io/cere-media-sdk-js/)

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

## Publish

1. Create a release

   ```
   npm run release
   ```
   It will detect the next version (based on [Conventional Commits](https://www.conventionalcommits.org/) history), update `CHANGELOG.md`s, create release tag, commit and push changes to the current branch.

   To create an unstable release (`-rc.*`):
   ```
   npm run release:rc
   ```

2. Publish the packages using [Publish GitHub Action](https://github.com/Cerebellum-Network/cere-ddc-sdk-js/actions/workflows/publish.yaml)

3. Deploy Playground using [Deploy playground GitHub Action](https://github.com/Cerebellum-Network/cere-ddc-sdk-js/actions/workflows/playground.yaml)
