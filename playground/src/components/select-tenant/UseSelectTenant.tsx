import { Tenant, Deployment } from '@cere/media-sdk-client';
import { useState } from 'react';

export const useSelectTenant = () => {
  const [tenant, setTenant] = useState<Tenant>('davinci');
  const [deployment, setDeployment] = useState<Deployment>('staging');
  const [logger, setLogger] = useState<boolean>(true);

  return {
    tenant,
    setTenant,
    deployment,
    setDeployment,
    logger,
    setLogger,
  };
};
