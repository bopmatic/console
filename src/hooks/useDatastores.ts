import { useEffect } from 'react';
import BopmaticClient from '../client/client';
import { useAtom, useSetAtom } from 'jotai';
import { datastoresAtom, datastoresLoadingAtom } from '../atoms';
import { DatastoreDescription } from '../client';
import { useDatastoreNames } from './useDatastoreNames';

export const useDatastores = (
  projectId: string | undefined,
  envId: string | undefined
) => {
  const [datastoresData] = useAtom(datastoresAtom); // Use the atom to read and update data
  const projectDatastoresData = projectId
    ? datastoresData[projectId]
    : undefined;
  const setDatastoresData = useSetAtom(datastoresAtom); // Another way to set data
  const setDatastoresLoadingData = useSetAtom(datastoresLoadingAtom);
  const datastoreNames = useDatastoreNames(projectId, envId);

  useEffect(() => {
    const fetchData = async () => {
      const datastores: DatastoreDescription[] = [];
      try {
        const apiCalls = [];
        if (datastoreNames && datastoreNames.length) {
          for (let i = 0; i < datastoreNames.length; i++) {
            apiCalls.push(
              BopmaticClient.describeDatastore({
                datastoreHeader: {
                  projEnvHeader: {
                    projId: projectId,
                    envId: envId,
                  },
                  datastoreName: datastoreNames[i],
                },
              })
            );
          }
          const allResponse = await Promise.all(apiCalls);
          for (const response of allResponse) {
            if (response.data.desc) {
              const projectDesc: DatastoreDescription = response.data.desc;
              datastores.push(projectDesc);
            }
          }
          datastoresData[projectId as string] = datastores;
          setDatastoresData(datastoresData);
          setDatastoresLoadingData(false);
        }
      } catch (error) {
        setDatastoresLoadingData(false);
      }
    };

    if (
      datastoreNames &&
      datastoreNames.length &&
      !projectDatastoresData?.length &&
      projectId &&
      envId
    ) {
      // Only fetch if the data isn't already loaded
      // setProjectLoadingAtom(true);
      fetchData();
      setDatastoresLoadingData(true);
    } else if (datastoreNames && !datastoreNames.length) {
      // this occurs when we fetched database names but its empty (no databases)
      setDatastoresLoadingData(false);
    }
  }, [
    datastoreNames,
    datastoresData,
    envId,
    projectDatastoresData?.length,
    projectId,
    setDatastoresData,
    setDatastoresLoadingData,
  ]); // Re-run if `setAtomData` changes or if `apiData` is null

  return projectDatastoresData;
};
