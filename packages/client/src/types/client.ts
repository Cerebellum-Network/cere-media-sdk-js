export const deployments = ['production', 'staging', 'development', 'local'] as const;
export type Deployment = (typeof deployments)[number];
export const tenants = ['davinci', 'cerefans'] as const;
export type Tenant = (typeof tenants)[number];

export interface MediaClientConfig {
  freeportApiUrl: string;
}
export interface MediaClientOptions {
  deployment: Deployment;
  tenant: Tenant;
  logger?: boolean;
}
