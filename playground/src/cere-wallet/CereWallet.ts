import { AbstractClientWallet, Connector } from '@thirdweb-dev/wallets';
import { CereWalletConnector } from './CereWalletConnector';

export class CereWallet extends AbstractClientWallet {
  constructor(
    id: string,
    private readonly idToken?: string,
  ) {
    super(id);
  }

  async getConnector(): Promise<Connector> {
    console.log('New Cere Wallet');
    return new CereWalletConnector(this.idToken);
  }
}
