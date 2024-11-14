import { useEffect } from 'react';
import { getBopmaticClient } from '../client/client';
import { useAtom, useSetAtom } from 'jotai';
import { databasesAtom, databasesLoadingAtom } from '../atoms';
import { DatabaseDescription } from '../client';
import { useDatabaseNames } from './useDatabaseNames';

export const useDatabases = (
  projectId: string | undefined,
  envId: string | undefined
): Array<DatabaseDescription> | undefined => {
  const [databasesData] = useAtom(databasesAtom); // Use the atom to read and update data
  const projectDatabaseData = projectId ? databasesData[projectId] : undefined;
  const setDatabasesData = useSetAtom(databasesAtom); // Another way to set data
  const setDatabasesLoadingData = useSetAtom(databasesLoadingAtom);
  const databaseNames = useDatabaseNames(projectId, envId);

  useEffect(() => {
    const fetchData = async () => {
      const databases: DatabaseDescription[] = [];
      try {
        const apiCalls = [];
        if (databaseNames && databaseNames.length) {
          for (let i = 0; i < databaseNames.length; i++) {
            apiCalls.push(
              getBopmaticClient().describeDatabase({
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
          databasesData[projectId as string] = databases;
          setDatabasesData(databasesData);
          setDatabasesLoadingData(false);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
        setDatabasesLoadingData(false);
      }
    };

    if (
      databaseNames &&
      databaseNames.length &&
      !projectDatabaseData?.length &&
      projectId &&
      envId
    ) {
      // Only fetch if the data isn't already loaded
      fetchData();
      setDatabasesLoadingData(true);
    } else if (databaseNames && !databaseNames.length) {
      // this occurs when we fetched database names but its empty (no databases)
      setDatabasesLoadingData(false);
    }
  }, [
    databaseNames,
    databasesData,
    envId,
    projectDatabaseData?.length,
    projectId,
    setDatabasesData,
    setDatabasesLoadingData,
  ]); // Re-run if `setAtomData` changes or if `apiData` is null

  return projectDatabaseData;
};
