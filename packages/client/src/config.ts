import { Deployment, MediaClientConfig } from './types';

export const mediaClientConfig: Record<Deployment, MediaClientConfig> = {
  local: {
    freeportApiUrl: 'http://localhost:3012',
  },
  development: {
    freeportApiUrl: 'https://dev-video-streaming.core-dev.aws.cere.io',
  },
  staging: {
    freeportApiUrl: '',
  },
  production: {
    freeportApiUrl: '',
  },
};
