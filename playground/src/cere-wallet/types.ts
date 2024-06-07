import { providers } from "ethers";
import { SignerInterface, SignerOptions, WalletEvent, WalletStatus } from "@cere/embed-wallet";

export interface IWalletConnector {
  preload?(): Promise<unknown>;
  connectToWallet(): Promise<providers.Web3Provider>;
  getStatus?(): WalletStatus;
  disconnect?(): Promise<void>;
  openWallet?(): Promise<void>;
  isNewUser?(): Promise<boolean | undefined>;
  getWalletSigner?(addressOrOptions?: SignerOptions | string): SignerInterface | undefined;
  subscribe(event: WalletEvent, handler: (status: WalletStatus, prevStatus: WalletStatus) => void): void;
}
