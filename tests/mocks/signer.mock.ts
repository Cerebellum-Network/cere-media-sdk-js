import { networkConfig } from '@cere/media-sdk-client';
import { Wallet, providers } from 'ethers';

export const mockProvider = new providers.JsonRpcProvider(networkConfig.development);

/**
 * A mock signer to use for testing. This account has been used on the Freeport Creator Suite to mint tokens for testing
 * This uses a hardcoded private key generated via https://vanity-eth.tk/ to prevent
 * the expense of generating a new private key for each test run.
 * @privateKey 39554408769372d0d7de3e80bed7acdae184a05f8cdca60dfdc528a17b3e922c
 * @address 0x744B0ae06Cd090b9F3D27Cd276fD6E4bE2F86210
 */
export const mockSigner = new Wallet('39554408769372d0d7de3e80bed7acdae184a05f8cdca60dfdc528a17b3e922c').connect(
  mockProvider,
);

/**
 * This is a mock signer that has no access to any tokens on the Freeport Creator Suite
 * @privateKey 99d6dfe688baef21a893697f7dc8d86e192c9c2fd0148a1e357a7fcfda0d21c0
 * @address 0x2fd3b37FE281577ea193a751690e0f703b5aB3A0
 */
export const mockSignerNoAccess = new Wallet(
  '99d6dfe688baef21a893697f7dc8d86e192c9c2fd0148a1e357a7fcfda0d21c0',
).connect(mockProvider);
