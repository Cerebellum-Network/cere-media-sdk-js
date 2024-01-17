import { Wallet } from 'ethers';

/**
 * A mock signer to use for testing. This account has been used on the Freeport Creator Suite to mint tokens for testing
 * This uses a hardcoded private key generated via https://vanity-eth.tk/ to prevent
 * the expense of generating a new private key for each test run.
 * @privateKey 39554408769372d0d7de3e80bed7acdae184a05f8cdca60dfdc528a17b3e922c
 * @address 0x744B0ae06Cd090b9F3D27Cd276fD6E4bE2F86210
 */
export const mockSigner = new Wallet('39554408769372d0d7de3e80bed7acdae184a05f8cdca60dfdc528a17b3e922c');
