import { useEffect } from 'react';
import BopmaticClient from '../client/client';
import { useAtom, useSetAtom } from 'jotai';
import { ProjectServiceNames, projectServiceNamesAtom } from '../atoms';

export const useServiceNames = (
  projectId: string | undefined,
  envId: string | undefined
): Array<string> | undefined => {
  const [projectServiceNamesData] = useAtom(projectServiceNamesAtom); // Use the atom to read and update data
  // if serviceNamesDataFilteredByProject it means we haven't yet called listServices for that projectId
  const serviceNamesDataFilteredByProject = projectServiceNamesData?.filter(
    (p) => p.projectId === projectId
  );
  const setProjectServiceNamesData = useSetAtom(projectServiceNamesAtom); // Another way to set data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const listServicesResponse = await BopmaticClient.listServices({
          header: {
            projId: projectId,
            envId: envId,
          },
        });
        const serviceNames = listServicesResponse.data.serviceNames;
        let projectServiceNames: ProjectServiceNames;
        if (serviceNames && serviceNames.length) {
          projectServiceNames = {
            projectId: projectId,
            serviceNames: serviceNames,
          };
        } else {
          // We still want to create a ProjectServiceNames wrapper so it indicates to our system
          // that we already made this API call for this projectId but this project has no services
          projectServiceNames = {
            projectId: projectId,
            serviceNames: [],
          };
        }
        setProjectServiceNamesData(
          !projectServiceNamesData
            ? [projectServiceNames]
            : [...projectServiceNamesData, projectServiceNames]
        );
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };

    // TODO: This isn't working; its calling ListProjects twice because of LeftNav and ProjectsTable using the hook; figure out why
    // if (!projectsData && !projectsLoadingData) {
    if (!serviceNamesDataFilteredByProject?.length && projectId && envId) {
      // Only fetch if the data isn't already loaded
      // setProjectLoadingAtom(true);
      fetchData();
    }
  }, [
    envId,
    projectId,
    projectServiceNamesData,
    serviceNamesDataFilteredByProject,
    setProjectServiceNamesData,
  ]); // Re-run if `setAtomData` changes or if `apiData` is null

  // Undefined means we haven't yet made the ListServices API call yet for this projectId
  return serviceNamesDataFilteredByProject &&
    serviceNamesDataFilteredByProject.length
    ? serviceNamesDataFilteredByProject[0].serviceNames
    : undefined;
};
