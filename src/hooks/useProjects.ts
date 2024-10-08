import { useAtom, useSetAtom } from 'jotai';
import { projectsAtom, projectsLoadingAtom } from '../atoms';
import { useEffect } from 'react';
import BopmaticClient from '../client/client';
import { ProjectDescription } from '../client';

export const useProjects = () => {
  const [projectsData] = useAtom(projectsAtom); // Use the atom to read and update data
  const [projectsLoadingData] = useAtom(projectsLoadingAtom);
  const setProjectAtomData = useSetAtom(projectsAtom); // Another way to set data
  const setProjectLoadingAtom = useSetAtom(projectsLoadingAtom);

  useEffect(() => {
    const fetchData = async () => {
      const projects: ProjectDescription[] = [];
      try {
        const listProjectsResponse = await BopmaticClient.listProjects({});
        const projectIds = listProjectsResponse.data.ids;
        const apiCalls = [];
        if (projectIds && projectIds.length) {
          for (let i = 0; i < projectIds.length; i++) {
            apiCalls.push(
              BopmaticClient.describeProject({
                id: projectIds[i],
              })
            );
          }
          const allResponse = await Promise.all(apiCalls);
          for (const response of allResponse) {
            if (response.data.desc) {
              const projectDesc: ProjectDescription = response.data.desc;
              projects.push(projectDesc);
            }
          }
          setProjectAtomData(projects);
          setProjectLoadingAtom(false);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
        setProjectLoadingAtom(false);
      }
    };

    // TODO: This isn't working; its calling ListProjects twice because of LeftNav and ProjectsTable using the hook; figure out why
    if (!projectsData && !projectsLoadingData) {
      // Only fetch if the data isn't already loaded
      setProjectLoadingAtom(true);
      fetchData();
    }
  }, [
    setProjectAtomData,
    projectsData,
    projectsLoadingData,
    setProjectLoadingAtom,
  ]); // Re-run if `setAtomData` changes or if `apiData` is null

  return projectsData;
};
