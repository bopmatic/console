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
  const [datastoresLoadingData] = useAtom(datastoresLoadingAtom);
  const setDatastoresData = useSetAtom(datastoresAtom); // Another way to set data
  const setDatastoresLoadingData = useSetAtom(datastoresLoadingAtom);
  const datastoreNames = useDatastoreNames(projectId, envId);

  useEffect(() => {
    const fetchData = async () => {
      const datastores: DatastoreDescription[] = [];
      try {
        // const listDatastoresResponse = await BopmaticClient.listDatastores({
        //   header: {
        //     projId: projectId,
        //     envId: envId,
        //   },
        // });
        // const datastoreNames = listDatastoresResponse.data.datastoreNames;
        // console.log('Got datastores back: ', listDatastoresResponse.data);
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
          setDatastoresData(datastores);
          setDatastoresLoadingData(false);
        }
      } catch (error) {
        setDatastoresLoadingData(false);
      }
    };

    // TODO: This isn't working; its calling ListProjects twice because of LeftNav and ProjectsTable using the hook; figure out why
    // if (!projectsData && !projectsLoadingData) {
    if (
      datastoreNames &&
      !datastoresData &&
      !datastoresLoadingData &&
      projectId &&
      envId
    ) {
      // Only fetch if the data isn't already loaded
      // setProjectLoadingAtom(true);
      fetchData();
      setDatastoresLoadingData(true);
    }
  }, [
    datastoreNames,
    datastoresData,
    datastoresLoadingData,
    envId,
    projectId,
    setDatastoresData,
    setDatastoresLoadingData,
  ]); // Re-run if `setAtomData` changes or if `apiData` is null

  return datastoresData;
};
