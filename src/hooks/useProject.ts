import { useProjects } from './useProjects';
import { useEffect, useState } from 'react';
import { ProjectDescription } from '../client';

export const useProject = (projectId: string | undefined) => {
  const projectsData = useProjects();
  const [projectData, setProjectData] = useState<ProjectDescription>();

  useEffect(() => {
    if (projectsData) {
      const project = projectsData.filter((proj) => proj.id === projectId)[0];
      setProjectData(project);
    }
  }, [projectId, projectsData]);

  return projectData;
};
