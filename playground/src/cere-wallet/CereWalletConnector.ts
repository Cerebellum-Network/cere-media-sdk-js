import { Connector } from '@thirdweb-dev/wallets';
import { EmbedWallet, WalletInitOptions, WalletStatus } from '@cere/embed-wallet';
import { Signer, providers } from 'ethers';

export type TorusWalletOptions = WalletInitOptions & {
  biconomyApiKey?: string;
  completeUrl?: string;
};

export class CereWalletConnector extends Connector {
  private cereWallet?: EmbedWallet;

  constructor(private options: TorusWalletOptions) {
    super();
    this.cereWallet?.subscribe('status-update', (status: WalletStatus, prevStatus: WalletStatus) => {
      if (prevStatus === 'connected' && status === 'ready') {
        window.location.reload();
      }
    });
  }

  get status() {
    if (!this.cereWallet) return;

    return this.cereWallet.status;
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
        host: 'https://polygon-mumbai.infura.io/v3/cba6e957aca549d9bf19c938a3d2548a',
        chainId: 80001,
      },
      context: {
        app: {
          name: 'Cere Media SDK Playground',
          url: window.origin,
          logoUrl: '/cere.png',
        },
      },
      connectOptions: {
        permissions: {
          personal_sign: {}, // Automatically sign messages with the user's approve
        },
      },
    });

    if (this.cereWallet.status === 'connected') {
      console.log('Cere Wallet already connected');
      const publicKey = await this.getAddress();
      localStorage.setItem('current-user-public-key', publicKey);
      return publicKey;
    }

    await this.cereWallet.connect();
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
