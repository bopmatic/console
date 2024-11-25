import { useEffect } from 'react';
import { getBopmaticClient } from '../client/client';
import { ServiceDescription } from '../client';
import { useAtom, useSetAtom } from 'jotai';
import { servicesAtom, servicesLoadingAtom } from '../atoms';
import { useServiceNames } from './useServiceNames';

export const useServices = (
  projectId: string | undefined,
  envId: string | undefined
): Array<ServiceDescription> | undefined => {
  const [servicesData] = useAtom(servicesAtom); // Use the atom to read and update data
  const projectServicesData = projectId ? servicesData[projectId] : undefined;
  const setServicesData = useSetAtom(servicesAtom); // Another way to set data
  const setServicesLoadingData = useSetAtom(servicesLoadingAtom);
  // NOTE: if serviceNames is undefined it means we haven't made the ListServices API call yet in useServiceNames for this particular project ID
  const serviceNames = useServiceNames(projectId, envId);

  useEffect(() => {
    const fetchData = async () => {
      const services: ServiceDescription[] = [];
      try {
        const apiCalls = [];
        // const serviceNames = projectServiceNames[0].serviceNames;
        if (serviceNames && serviceNames.length) {
          for (let i = 0; i < serviceNames.length; i++) {
            apiCalls.push(
              getBopmaticClient().describeService({
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
          servicesData[projectId as string] = services;
          setServicesData(servicesData);
          setServicesLoadingData(false);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
        setServicesLoadingData(false);
      }
    };

    // TODO: This isn't working; its calling ListProjects twice because of LeftNav and ProjectsTable using the hook; figure out why
    // if (!projectsData && !projectsLoadingData) {
    //       !servicesLoadingData &&
    if (
      serviceNames &&
      serviceNames.length &&
      !projectServicesData?.length &&
      projectId &&
      envId
    ) {
      // Only fetch if the data isn't already loaded
      // setProjectLoadingAtom(true);
      fetchData();
      setServicesLoadingData(true);
    } else if (serviceNames && !serviceNames.length) {
      setServicesLoadingData(false);
    }
  }, [
    envId,
    projectId,
    projectServicesData?.length,
    serviceNames,
    servicesData,
    setServicesData,
    setServicesLoadingData,
  ]); // Re-run if `setAtomData` changes or if `apiData` is null

  return projectServicesData;
};
