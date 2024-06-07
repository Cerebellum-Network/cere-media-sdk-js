import { CereWallet } from "./CereWallet.ts";
import { Web3Provider } from "@ethersproject/providers";
import { IWalletConnector } from "./types.ts";
import { Signer } from "ethers";
import { WalletEvent, WalletStatus } from "@cere/embed-wallet";

export class CereWalletConnector implements IWalletConnector{
  constructor(private readonly torusWallet: CereWallet) {}
  async preload(): Promise<unknown> {
    await this.torusWallet.init();
    return this.torusWallet.isReady();
  }

  async connectToWallet(): Promise<Web3Provider> {
    await this.torusWallet.connect();
    return this.torusWallet.getProvider();
  }

  async getSigner(): Promise<Signer> {
    const signer = await this.torusWallet.getSigner();
    if (!signer) {
      throw Error('Signer not found');
    }
    return signer;
  }

  getStatus(): WalletStatus {
    return this.torusWallet.getStatus();
  }

  async disconnectWallet(): Promise<void> {
    return await this.torusWallet.disconnect();
  }

  subscribe(event: WalletEvent, handler: (status: WalletStatus, prevStatus: WalletStatus) => void) {
    return this.torusWallet.subscribe(event, handler)
  }
}
