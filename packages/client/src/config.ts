export interface MediaClientConfig {
  freeportApi: string;
}

export type Deployment = 'production' | 'staging' | 'development' | 'local';

export const config: Record<Deployment, MediaClientConfig> = {
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
