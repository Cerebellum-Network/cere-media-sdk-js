import { CereWallet } from './CereWallet';
import { WalletEnvironment } from '@cere/embed-wallet';

export const cereWallet = (env: WalletEnvironment) => {
  return {
    id: 'cere-wallet',
    meta: {
      name: 'Cere Wallet',
      iconURL: '/cere.png',
    },
    create: () => {
      return new CereWallet('cere-wallet', env);
    },
  };
};
