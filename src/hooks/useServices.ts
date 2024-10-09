import { useEffect } from 'react';
import BopmaticClient from '../client/client';
import { ServiceDescription } from '../client';
import { useAtom, useSetAtom } from 'jotai';
import { servicesAtom, servicesLoadingAtom } from '../atoms';
import { useServiceNames } from './useServiceNames';

export const useServices = (
  projectId: string | undefined,
  envId: string | undefined
) => {
  const [servicesData] = useAtom(servicesAtom); // Use the atom to read and update data
  const [servicesLoadingData] = useAtom(servicesLoadingAtom);
  const setServicesData = useSetAtom(servicesAtom); // Another way to set data
  const setServicesLoadingData = useSetAtom(servicesLoadingAtom);
  const serviceNames = useServiceNames(projectId, envId);

  useEffect(() => {
    const fetchData = async () => {
      const services: ServiceDescription[] = [];
      try {
        // const listServicesResponse = await BopmaticClient.listServices({
        //   header: {
        //     projId: projectId,
        //     envId: envId,
        //   },
        // });
        // const serviceNames = listServicesResponse.data.serviceNames;
        const apiCalls = [];
        if (serviceNames && serviceNames.length) {
          for (let i = 0; i < serviceNames.length; i++) {
            apiCalls.push(
              BopmaticClient.describeService({
                svcHeader: {
                  projEnvHeader: {
                    projId: projectId,
                    envId: envId,
                  },
                  serviceName: serviceNames[i],
                },
              })
            );
          }
          const allResponse = await Promise.all(apiCalls);
          for (const response of allResponse) {
            if (response.data.desc) {
              const projectDesc: ServiceDescription = response.data.desc;
              services.push(projectDesc);
            }
          }
          setServicesData(services);
          setServicesLoadingData(false);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
        setServicesLoadingData(false);
      }
    };

    // TODO: This isn't working; its calling ListProjects twice because of LeftNav and ProjectsTable using the hook; figure out why
    // if (!projectsData && !projectsLoadingData) {
    if (
      serviceNames &&
      !servicesData &&
      !servicesLoadingData &&
      projectId &&
      envId
    ) {
      // Only fetch if the data isn't already loaded
      // setProjectLoadingAtom(true);
      fetchData();
      setServicesLoadingData(true);
    }
  }, [
    envId,
    projectId,
    serviceNames,
    servicesData,
    servicesLoadingData,
    setServicesData,
    setServicesLoadingData,
  ]); // Re-run if `setAtomData` changes or if `apiData` is null

  return servicesData;
};
