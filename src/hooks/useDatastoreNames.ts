import { useEffect } from 'react';
import BopmaticClient from '../client/client';
import { useAtom, useSetAtom } from 'jotai';
import { datastoreNamesAtom } from '../atoms';

export const useDatastoreNames = (
  projectId: string | undefined,
  envId: string | undefined
) => {
  const [datastoreNamesData] = useAtom(datastoreNamesAtom); // Use the atom to read and update data
  const setDatastoreNamesData = useSetAtom(datastoreNamesAtom); // Another way to set data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const listDatastoresResponse = await BopmaticClient.listDatastores({
          header: {
            projId: projectId,
            envId: envId,
          },
        });
        const datastoreNames = listDatastoresResponse.data.datastoreNames;
        if (datastoreNames && datastoreNames.length) {
          console.log('setting datastoreNames atom:', datastoreNames);
          setDatastoreNamesData(datastoreNames);
        } else {
          // we got a response but no data, implying its empty
          setDatastoreNamesData([]);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };

    // TODO: This isn't working; its calling ListProjects twice because of LeftNav and ProjectsTable using the hook; figure out why
    // if (!projectsData && !projectsLoadingData) {
    if (!datastoreNamesData && projectId && envId) {
      // Only fetch if the data isn't already loaded
      // setProjectLoadingAtom(true);
      fetchData();
    }
  }, [envId, projectId, datastoreNamesData, setDatastoreNamesData]); // Re-run if `setAtomData` changes or if `apiData` is null

  return datastoreNamesData;
};
