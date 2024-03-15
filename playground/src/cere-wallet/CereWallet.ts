import { AbstractClientWallet, Connector } from '@thirdweb-dev/wallets';
import { CereWalletConnector } from './CereWalletConnector';
import { WalletEnvironment } from '@cere/embed-wallet';

export class CereWallet extends AbstractClientWallet {
  constructor(
    id: string,
    private readonly env?: WalletEnvironment,
  ) {
    super(id);
  }

  async getConnector(): Promise<Connector> {
    return new CereWalletConnector({ env: this.env || 'dev' });
  }
}
