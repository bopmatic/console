import { ApiHealthWrapper } from '../atoms';
import { useEffect, useState } from 'react';
import { useApiHealth } from './useApiHealth';
import { ServiceApiWrapper } from './utils';
import { useServices } from './useServices';

export const useServiceHealth = (
  envId: string | undefined,
  projectId: string | undefined,
  serviceNames: string[] | undefined
): [ApiHealthWrapper[] | undefined, boolean] => {
  const services = useServices(projectId, envId);
  const [serviceApiWrappers, setServiceApiWrappers] = useState<
    ServiceApiWrapper[]
  >([]);
  const [apiHealthArr, isLoading] = useApiHealth(
    envId,
    projectId,
    serviceApiWrappers
  );
  useEffect(() => {
    if (
      envId &&
      projectId &&
      serviceNames &&
      services &&
      services.length &&
      (!serviceApiWrappers || !serviceApiWrappers.length)
    ) {
      const serviceApiWrappers: ServiceApiWrapper[] = [];
      for (let i = 0; i < services.length; i++) {
        const s = services[i];
        if (
          s.svcHeader &&
          s.svcHeader.serviceName &&
          serviceNames.includes(s.svcHeader.serviceName)
        ) {
          if (s.rpcEndpoints) {
            for (let ii = 0; ii < s.rpcEndpoints.length; ii++) {
              const rpcEndpoint = s.rpcEndpoints[ii];
              const apiName = rpcEndpoint.substring(
                rpcEndpoint.lastIndexOf('/') + 1
              );
              const serviceApiWrapper: ServiceApiWrapper = {
                serviceName: s.svcHeader.serviceName,
                apiName: apiName,
              };
              serviceApiWrappers.push(serviceApiWrapper);
            }
          }
        }
      }
      console.log('++++++ setting serviceApiWrappers:', serviceApiWrappers);
      setServiceApiWrappers(serviceApiWrappers);
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [envId, projectId, serviceNames, services]);
  return [apiHealthArr, isLoading];
};
