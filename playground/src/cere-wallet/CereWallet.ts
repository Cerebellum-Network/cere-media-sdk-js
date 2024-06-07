import { EmbedWallet, WalletEvent, WalletStatus } from "@cere/embed-wallet";
import { Signer, providers, ethers } from "ethers";

export class CereWallet {
  private wallet = new EmbedWallet();

  private walletStatus: WalletStatus = 'not-ready';

  get status() {
    return this.wallet.status;
  }

  async init(){
    console.log('torus status', this.status);
    if (this.status !== 'not-ready') {
      return;
    }

    await this.wallet?.init({
      context: {
        app: {
          name: 'Cere Media SDK Playground',
          url: window.origin,
          logoUrl: '/cere.png',
        },

      },
      network: {
        host: 'https://polygon-amoy.infura.io/v3/cba6e957aca549d9bf19c938a3d2548a',
        chainId: 80002,
      },
      env: 'dev',
    });

  }

  async connect() {
    if (this.status === 'connected') {
      return this.getAddress();
    }

    await  this.wallet?.isReady;

    await this.wallet?.connect();

    return this.getAddress();
  }

  async disconnect(): Promise<void> {
    await this.wallet?.disconnect();
  }

  async getAddress(): Promise<string> {
    const signer = await this.getSigner();
    return await signer.getAddress();
  }

  async getSigner(): Promise<Signer> {
    const provider = (await this.getProvider()) as providers.Web3Provider;
    return provider.getSigner();
  }

  getProvider() {
    return new ethers.providers.Web3Provider(this.wallet.provider);
  }

  async switchChain(): Promise<void> {
    return Promise.resolve();
  }

  async isConnected(): Promise<boolean> {
    try {
      await this.wallet?.isReady;
    } catch (e) {
      return false;
    }
    return true;
  }

  isReady(): Promise<unknown> {
    return this.wallet.isReady.then(() => null);
  }


  getStatus(): WalletStatus {
    console.log(this.wallet);
    return this.wallet.status;
  }

  subscribe(event: WalletEvent, handler: (status: WalletStatus, prevStatus: WalletStatus) => void) {
    return this.wallet.subscribe(event, handler);
  }
}
