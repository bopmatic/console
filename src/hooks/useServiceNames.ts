import { useEffect } from 'react';
import BopmaticClient from '../client/client';
import { useAtom, useSetAtom } from 'jotai';
import { serviceNamesAtom } from '../atoms';

export const useServiceNames = (
  projectId: string | undefined,
  envId: string | undefined
) => {
  const [serviceNamesData] = useAtom(serviceNamesAtom); // Use the atom to read and update data
  const setServiceNamesData = useSetAtom(serviceNamesAtom); // Another way to set data

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
        if (serviceNames && serviceNames.length) {
          console.log('setting serviceNames atom:', serviceNames);
          setServiceNamesData(serviceNames);
        } else {
          // we got a response but no data, implying its empty
          setServiceNamesData([]);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };

    // TODO: This isn't working; its calling ListProjects twice because of LeftNav and ProjectsTable using the hook; figure out why
    // if (!projectsData && !projectsLoadingData) {
    if (!serviceNamesData && projectId && envId) {
      // Only fetch if the data isn't already loaded
      // setProjectLoadingAtom(true);
      fetchData();
    }
  }, [envId, projectId, serviceNamesData, setServiceNamesData]); // Re-run if `setAtomData` changes or if `apiData` is null

  return serviceNamesData;
};
