import { Deployment, MediaClientConfig, Tenant } from '../types';

export const mediaClientConfig: Record<Deployment, Record<Tenant, MediaClientConfig>> = {
  local: {
    davinci: { freeportApiUrl: 'http://localhost:3012' },
    cerefans: { freeportApiUrl: 'http://localhost:3012' },
  },
  development: {
    davinci: { freeportApiUrl: 'https://dev-freeport-api.network-dev.aws.cere.io' },
    cerefans: { freeportApiUrl: 'https://dev-freeport-api-cerefans.network-dev.aws.cere.io/' },
  },
  staging: {
    davinci: { freeportApiUrl: '' },
    cerefans: { freeportApiUrl: '' },
  },
  production: {
    davinci: { freeportApiUrl: '' },
    cerefans: { freeportApiUrl: '' },
  },
};

export const networkConfig: Record<Deployment, string> = {
  local: 'https://polygon-mumbai.blockpi.network/v1/rpc/public',
  development: 'https://polygon-mumbai.blockpi.network/v1/rpc/public',
  staging: 'https://polygon-mumbai.blockpi.network/v1/rpc/public',
  production: 'https://polygon-mainnet.blockpi.network/v1/rpc/public',
};
