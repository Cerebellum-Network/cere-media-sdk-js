export type Deployment = 'production' | 'staging' | 'development' | 'local';
export interface MediaClientConfig {
  freeportApiUrl: string;
}
export interface MediaClientOptions {
  deployment: Deployment;
  logger?: boolean;
}

export interface FreeportApiClientOptions {
  logger?: boolean;
  freeportApiUrl: string;
}
