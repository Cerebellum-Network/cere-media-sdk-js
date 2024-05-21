import { Connector } from '@thirdweb-dev/wallets';
import { EmbedWallet } from '@cere/embed-wallet';
import { Signer, providers } from 'ethers';

export class CereWalletConnector extends Connector {
  private cereWallet?: EmbedWallet;

  private idToken: string = '';

  constructor(idToken?: string) {
    super();
    if (idToken) {
      this.idToken = idToken;
    }
  }

  async connect(): Promise<string> {
    if (!this.cereWallet) {
      console.log('Creating Cere Wallet Instance');
      this.cereWallet = new EmbedWallet();
    }
    console.log('Connecting Cere Wallet');
    await this.cereWallet.init({
      env: 'dev',
      popupMode: 'modal',
      network: {
        host: 'https://polygon-amoy.infura.io/v3/cba6e957aca549d9bf19c938a3d2548a',
        chainId: 80002,
      },
      context: {
        app: {
          name: 'Cere Media SDK Playground',
          url: window.origin,
          logoUrl: '/cere.png',
        },
      },
    });

    if (this.cereWallet.status === 'connected') {
      console.log('Cere Wallet already connected');
      return this.getAddress();
    }

    await this.cereWallet.connect({
      idToken: this.idToken,
      mode: 'redirect',
      redirectUrl: window.location.href,
    });
    console.log('Cere Wallet connected');
    return this.getAddress();
  }

  async disconnect(): Promise<void> {
    await this.cereWallet?.disconnect();
    delete this.cereWallet;
  }

  async getAddress(): Promise<string> {
    const signer = await this.getSigner();
    return await signer.getAddress();
  }

  async getSigner(): Promise<Signer> {
    const provider = (await this.getProvider()) as providers.Web3Provider;
    return provider.getSigner();
  }

  async getProvider(): Promise<providers.Provider> {
    if (!this.cereWallet) {
      await this.connect();
    }
    const provider = new providers.Web3Provider(this.cereWallet!.provider);
    // @ts-expect-error -- expose show wallet
    provider.showWallet = this.cereWallet?.showWallet;
    return provider;
  }

  async switchChain(): Promise<void> {
    return Promise.resolve();
  }

  async isConnected(): Promise<boolean> {
    try {
      await this.cereWallet?.isReady;
    } catch (e) {
      return false;
    }
    return true;
  }

  async setupListeners(): Promise<void> {}

  updateChains() {
    return;
  }
}
