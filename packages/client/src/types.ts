export type Deployment = 'production' | 'staging' | 'development' | 'local';
export interface MediaClientConfig {
  freeportApi: string;
}
export interface MediaClientOptions {
  deployment: Deployment;
  logger?: boolean;
}
