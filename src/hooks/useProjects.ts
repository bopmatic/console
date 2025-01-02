import { useAtom, useSetAtom } from 'jotai';
import { projectsAtom, projectsLoadingAtom } from '../atoms';
import { useEffect } from 'react';
import { getBopmaticClient } from '../client/client';
import { ProjectDescription } from '../client';

export const useProjects = () => {
  const [projectsData] = useAtom(projectsAtom); // Use the atom to read and update data
  const setProjectAtomData = useSetAtom(projectsAtom); // Another way to set data
  const setProjectLoadingAtom = useSetAtom(projectsLoadingAtom);

  useEffect(() => {
    const fetchData = async () => {
      const projects: ProjectDescription[] = [];
      try {
        const listProjectsResponse = await getBopmaticClient().listProjects({});
        const projectIds = listProjectsResponse.data.ids;
        const apiCalls = [];
        if (projectIds && projectIds.length) {
          for (let i = 0; i < projectIds.length; i++) {
            apiCalls.push(
              getBopmaticClient().describeProject({
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
        }
        setProjectLoadingAtom(false);
      } catch (error) {
        console.error('Failed to fetch data', error);
        setProjectLoadingAtom(false);
      }
    };

    if (!projectsData) {
      // Only fetch if the data isn't already loaded
      setProjectLoadingAtom(true);
      fetchData();
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [setProjectAtomData, projectsData]); // Re-run if `setAtomData` changes or if `apiData` is null

  return projectsData;
};
