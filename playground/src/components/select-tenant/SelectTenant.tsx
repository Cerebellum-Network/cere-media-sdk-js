import { Deployment, Tenant, tenants, deployments } from '@cere-media-sdk/client';
import { Box, Divider, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';

export interface SelectTenantProps {
  tenant: Tenant;
  setTenant: (tenant: Tenant) => void;
  deployment: Deployment;
  setDeployment: (deployment: Deployment) => void;
  logger: boolean;
  setLogger: (logger: boolean) => void;
}

export const SelectTenant = ({
  tenant,
  setTenant,
  deployment,
  setDeployment,
  logger,
  setLogger,
}: SelectTenantProps) => {
  const onChangeLogger = (e: SelectChangeEvent<'enabled' | 'disabled'>) => {
    setLogger(e.target.value === 'enabled');
  };

  return (
    <Box display="flex" flexDirection="column" gap="10px" pt="10px" textAlign="left">
      <Typography variant="h6"> SDK Config</Typography>
      <Divider />

      <Typography>Tenant</Typography>
      <Select value={tenant} onChange={(e) => setTenant(e.target.value as Tenant)} size="small">
        {tenants.map((tenant) => (
          <MenuItem key={tenant} value={tenant}>
            {tenant.toUpperCase()}
          </MenuItem>
        ))}
      </Select>

      <Typography>Deployment</Typography>
      <Select value={deployment} onChange={(e) => setDeployment(e.target.value as Deployment)} size="small">
        {deployments.map((deployment) => (
          <MenuItem key={deployment} value={deployment}>
            {deployment.toUpperCase()}
          </MenuItem>
        ))}
      </Select>

      <Typography>Logger</Typography>
      <Select value={logger ? 'enabled' : 'disabled'} onChange={onChangeLogger} size="small">
        <MenuItem key="true" value="enabled">
          Enabled
        </MenuItem>
        <MenuItem key="false" value="disabled">
          Disabled
        </MenuItem>
      </Select>
    </Box>
  );
};
