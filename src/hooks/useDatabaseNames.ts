import { useEffect } from 'react';
import BopmaticClient from '../client/client';
import { useAtom, useSetAtom } from 'jotai';
import { databaseNamesAtom } from '../atoms';

export const useDatabaseNames = (
  projectId: string | undefined,
  envId: string | undefined
) => {
  const [databaseNamesData] = useAtom(databaseNamesAtom); // Use the atom to read and update data
  const setDatabaseNamesData = useSetAtom(databaseNamesAtom); // Another way to set data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const listDatabasesResponse = await BopmaticClient.listDatabases({
          header: {
            projId: projectId,
            envId: envId,
          },
        });
        const databaseNames = listDatabasesResponse.data.databaseNames;
        if (databaseNames && databaseNames.length) {
          console.log('setting databaseNames atom:', databaseNames);
          setDatabaseNamesData(databaseNames);
        } else {
          // we got a response but no data, implying its empty
          setDatabaseNamesData([]);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };

    // TODO: This isn't working; its calling ListProjects twice because of LeftNav and ProjectsTable using the hook; figure out why
    // if (!projectsData && !projectsLoadingData) {
    if (!databaseNamesData && projectId && envId) {
      // Only fetch if the data isn't already loaded
      // setProjectLoadingAtom(true);
      fetchData();
    }
  }, [envId, projectId, databaseNamesData, setDatabaseNamesData]); // Re-run if `setAtomData` changes or if `apiData` is null

  return databaseNamesData;
};
