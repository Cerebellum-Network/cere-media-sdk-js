import { Deployment, MediaClientConfig } from './types';

export const mediaClientConfig: Record<Deployment, MediaClientConfig> = {
  local: {
    freeportApi: 'http://localhost:3012',
  },
  development: {
    freeportApi: 'https://dev-video-streaming.core-dev.aws.cere.io',
  },
  staging: {
    freeportApi: '',
  },
  production: {
    freeportApi: '',
  },
};
