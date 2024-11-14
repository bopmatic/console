import { useEffect } from 'react';
import BopmaticClient from '../client/client';
import { useAtom, useSetAtom } from 'jotai';
import { ProjectDatastoreNames, projectDatastoreNamesAtom } from '../atoms';

export const useDatastoreNames = (
  projectId: string | undefined,
  envId: string | undefined
): Array<string> | undefined => {
  const [projectDatastoreNamesData] = useAtom(projectDatastoreNamesAtom); // Use the atom to read and update data
  // if datastoreNamesDataFilteredByProject it means we haven't yet called listServices for that projectId
  const datastoreNamesDataFilteredByProject = projectDatastoreNamesData?.filter(
    (p) => p.projectId === projectId
  );
  const setProjectDatastoreNamesData = useSetAtom(projectDatastoreNamesAtom); // Another way to set data

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
        let projectDataStoreNames: ProjectDatastoreNames;
        if (datastoreNames && datastoreNames.length) {
          projectDataStoreNames = {
            projectId: projectId,
            datastoreNames: datastoreNames,
          };
        } else {
          // we got a response but no data, implying its empty
          projectDataStoreNames = {
            projectId: projectId,
            datastoreNames: [],
          };
        }
        setProjectDatastoreNamesData(
          !projectDatastoreNamesData
            ? [projectDataStoreNames]
            : [...projectDatastoreNamesData, projectDataStoreNames]
        );
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };

    // TODO: This isn't working; its calling ListProjects twice because of LeftNav and ProjectsTable using the hook; figure out why
    // if (!projectsData && !projectsLoadingData) {
    if (!datastoreNamesDataFilteredByProject?.length && projectId && envId) {
      // Only fetch if the data isn't already loaded
      // setProjectLoadingAtom(true);
      fetchData();
    }
  }, [
    envId,
    projectId,
    projectDatastoreNamesData,
    setProjectDatastoreNamesData,
    datastoreNamesDataFilteredByProject?.length,
  ]); // Re-run if `setAtomData` changes or if `apiData` is null

  // Undefined means we haven't yet made the ListServices API call yet for this projectId
  return datastoreNamesDataFilteredByProject &&
    datastoreNamesDataFilteredByProject.length
    ? datastoreNamesDataFilteredByProject[0].datastoreNames
    : undefined;
};
