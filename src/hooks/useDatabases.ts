import { useEffect } from 'react';
import BopmaticClient from '../client/client';
import { useAtom, useSetAtom } from 'jotai';
import { databasesAtom, databasesLoadingAtom } from '../atoms';
import { DatabaseDescription } from '../client';
import { useDatabaseNames } from './useDatabaseNames';

export const useDatabases = (
  projectId: string | undefined,
  envId: string | undefined
) => {
  const [databasesData] = useAtom(databasesAtom); // Use the atom to read and update data
  const [databasesLoadingData] = useAtom(databasesLoadingAtom);
  const setDatabasesData = useSetAtom(databasesAtom); // Another way to set data
  const setDatabasesLoadingData = useSetAtom(databasesLoadingAtom);
  const databaseNames = useDatabaseNames(projectId, envId);

  useEffect(() => {
    const fetchData = async () => {
      const databases: DatabaseDescription[] = [];
      try {
        // const listDatabasesResponse = await BopmaticClient.listDatabases({
        //   header: {
        //     projId: projectId,
        //     envId: envId,
        //   },
        // });
        // const databaseNames = listDatabasesResponse.data.databaseNames;
        const apiCalls = [];
        if (databaseNames && databaseNames.length) {
          for (let i = 0; i < databaseNames.length; i++) {
            apiCalls.push(
              BopmaticClient.describeDatabase({
                databaseHeader: {
                  projEnvHeader: {
                    projId: projectId,
                    envId: envId,
                  },
                  databaseName: databaseNames[i],
                },
              })
            );
          }
          const allResponse = await Promise.all(apiCalls);
          for (const response of allResponse) {
            if (response.data.desc) {
              const projectDesc: DatabaseDescription = response.data.desc;
              databases.push(projectDesc);
            }
          }
          console.log('databases', databases);
          setDatabasesData(databases);
          setDatabasesLoadingData(false);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
        setDatabasesLoadingData(false);
      }
    };

    // TODO: This isn't working; its calling ListProjects twice because of LeftNav and ProjectsTable using the hook; figure out why
    // if (!projectsData && !projectsLoadingData) {
    if (
      databaseNames &&
      !databasesData &&
      !databasesLoadingData &&
      projectId &&
      envId
    ) {
      // Only fetch if the data isn't already loaded
      // setProjectLoadingAtom(true);
      fetchData();
      setDatabasesLoadingData(true);
    }
  }, [
    databaseNames,
    databasesData,
    databasesLoadingData,
    envId,
    projectId,
    setDatabasesData,
    setDatabasesLoadingData,
  ]); // Re-run if `setAtomData` changes or if `apiData` is null

  return databasesData;
};
