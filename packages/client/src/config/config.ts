import { Deployment, MediaClientConfig, Tenant } from '../types';

export const mediaClientConfig: Record<Deployment, Record<Tenant, MediaClientConfig>> = {
  local: {
    davinci: { freeportApiUrl: 'http://localhost:3012/' },
    cerefans: { freeportApiUrl: 'http://localhost:3012/' },
  },
  development: {
    davinci: { freeportApiUrl: 'https://dev-freeport-api.network-dev.aws.cere.io/' },
    cerefans: { freeportApiUrl: 'https://dev-freeport-api-cerefans.network-dev.aws.cere.io/' },
  },
  staging: {
    davinci: { freeportApiUrl: 'https://stage-freeport-api.network-stage.aws.cere.io/' },
    cerefans: { freeportApiUrl: 'https://stage-freeport-api-cerefans.network-stage.aws.cere.io/' },
  },
  production: {
    davinci: { freeportApiUrl: 'https://prod-freeport-api.network.aws.cere.io/' },
    cerefans: { freeportApiUrl: 'https://prod-freeport-api-cerefans.network.aws.cere.io/' },
  },
};

export const networkConfig: Record<Deployment, string> = {
  local: 'https://polygon-amoy.blockpi.network/v1/rpc/public',
  development: 'https://polygon-amoy.blockpi.network/v1/rpc/public',
  staging: 'https://polygon-amoy.blockpi.network/v1/rpc/public',
  production: 'https://polygon-mainnet.blockpi.network/v1/rpc/public',
};
