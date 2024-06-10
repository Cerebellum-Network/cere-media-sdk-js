import { providers, Signer } from 'ethers';
import { WalletEvent, WalletStatus } from '@cere/embed-wallet';
import { Web3authChainNamespace } from '@cere/media-sdk-client';

export interface IWalletConnector {
  preload?(): Promise<unknown>;
  connectToWallet(): Promise<providers.Web3Provider>;
  getStatus?(): WalletStatus;
  disconnect?(): Promise<void>;
  openWallet?(): Promise<void>;
  isNewUser?(): Promise<boolean | undefined>;
  getWalletSigner?(chainNamespace: Web3authChainNamespace): Signer | undefined;
  subscribe(event: WalletEvent, handler: (status: WalletStatus, prevStatus: WalletStatus) => void): void;
}
