export type Deployment = 'production' | 'staging' | 'development' | 'local';
export type Tenant = 'davinci' | 'cerefans';

export interface MediaClientConfig {
  freeportApiUrl: string;
}
export interface MediaClientOptions {
  deployment: Deployment;
  tenant: Tenant;
  logger?: boolean;
}
