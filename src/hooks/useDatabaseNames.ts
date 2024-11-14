import { useEffect } from 'react';
import BopmaticClient from '../client/client';
import { useAtom, useSetAtom } from 'jotai';
import { ProjectDatabaseNames, projectDatabaseNamesAtom } from '../atoms';

export const useDatabaseNames = (
  projectId: string | undefined,
  envId: string | undefined
): Array<string> | undefined => {
  const [projectDatabaseNamesData] = useAtom(projectDatabaseNamesAtom); // Use the atom to read and update data
  // if databaseNamesDataFilteredByProject it means we haven't yet called ListDatabases for that projectId
  const databaseNamesDataFilteredByProject = projectDatabaseNamesData?.filter(
    (p) => p.projectId === projectId
  );
  const setProjectDatabaseNamesData = useSetAtom(projectDatabaseNamesAtom); // Another way to set data

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
        let projectDatabaseNames: ProjectDatabaseNames;
        if (databaseNames && databaseNames.length) {
          projectDatabaseNames = {
            projectId: projectId,
            databaseNames: databaseNames,
          };
        } else {
          // we got a response but no data, implying its empty
          projectDatabaseNames = {
            projectId: projectId,
            databaseNames: [],
          };
        }
        setProjectDatabaseNamesData(
          projectDatabaseNamesData
            ? [...projectDatabaseNamesData, projectDatabaseNames]
            : [projectDatabaseNames]
        );
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };

    // TODO: This isn't working; its calling ListProjects twice because of LeftNav and ProjectsTable using the hook; figure out why
    // if (!projectsData && !projectsLoadingData) {
    if (!databaseNamesDataFilteredByProject?.length && projectId && envId) {
      // Only fetch if the data isn't already loaded
      // setProjectLoadingAtom(true);
      fetchData();
    }
  }, [
    envId,
    projectId,
    projectDatabaseNamesData,
    setProjectDatabaseNamesData,
    databaseNamesDataFilteredByProject?.length,
  ]); // Re-run if `setAtomData` changes or if `apiData` is null

  // Undefined means we haven't yet made the ListServices API call yet for this projectId
  return databaseNamesDataFilteredByProject &&
    databaseNamesDataFilteredByProject.length
    ? databaseNamesDataFilteredByProject[0].databaseNames
    : undefined;
};
