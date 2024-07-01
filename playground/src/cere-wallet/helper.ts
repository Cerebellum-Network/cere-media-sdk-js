import { ChainNamespace } from '@cere/media-sdk-client';
import { WalletAccountType } from '@cere/embed-wallet';

const chainNamespaceToAccountType: Record<ChainNamespace, WalletAccountType> = {
  [ChainNamespace.EIP155]: 'ethereum',
  [ChainNamespace.SOLANA]: 'solana',
};

export const getWalletAccountType = (chainNamespace: ChainNamespace): WalletAccountType => {
  return chainNamespaceToAccountType[chainNamespace];
};
