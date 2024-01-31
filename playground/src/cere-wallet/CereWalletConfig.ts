import { CereWallet } from './CereWallet';

export const cereWallet = (idToken?: string) => {
  return {
    id: 'cere-wallet',
    meta: {
      name: 'Cere Wallet',
      iconURL: '/cere.png',
    },
    create: () => {
      return new CereWallet('cere-wallet', idToken);
    },
  };
};
