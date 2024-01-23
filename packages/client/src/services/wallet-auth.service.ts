const WALLET_CREDENTIAL_CACHE_KEY = 'cere-media-sdk-credentials';

export interface WalletCredentials {
  ['x-message']: string;
  ['x-signature']: string;
  ['x-public-key']: string;
}

export const getCachedCredentials = (): WalletCredentials | undefined => {
  console.log('calling cached');
  if (typeof window === 'undefined') {
    console.log("typeof window === 'undefined'");
    return undefined;
  }
  const cached = localStorage.getItem(WALLET_CREDENTIAL_CACHE_KEY);
  if (!cached) {
    return undefined;
  }
  return JSON.parse(cached) as WalletCredentials;
};

export const setCachedCredentials = (credentials: WalletCredentials): void => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(WALLET_CREDENTIAL_CACHE_KEY, JSON.stringify(credentials));
};

export const clearCachedCredentials = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem(WALLET_CREDENTIAL_CACHE_KEY);
};

export const hoursToMilliseconds = (hours: number): number => {
  return hours * 60 * 60 * 1000;
};
