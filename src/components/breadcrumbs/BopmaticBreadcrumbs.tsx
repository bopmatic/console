import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import BopmaticLink from '../link/BopmaticLink';
import { Breadcrumbs, Typography } from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { useProjects } from '../../hooks/useProjects';
import { ProjectDescription } from '../../client';

const BopmaticBreadcrumbs: React.FC = () => {
  const location = useLocation();
  const projects = useProjects();
  const [projectsMap, setProjectsMap] =
    useState<Map<string, ProjectDescription>>();

  useEffect(() => {
    if (projects) {
      const m = new Map<string, ProjectDescription>();
      for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        m.set(project.id as string, project);
      }
      setProjectsMap(m);
    }
  }, [projects]);

  const getProjectNameFromProjectId = useCallback(
    (projectId: string) => {
      if (!projectsMap) {
        return projectId;
      } else {
        return projectsMap.get(projectId)?.header?.name ?? projectId;
      }
    },
    [projectsMap]
  );

  // Split the pathname into an array of path segments
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextIcon fontSize="small" />}
    >
      {pathnames.map((value, index) => {
        // Map project ID to project name
        if (value.startsWith('proj-')) {
          value = getProjectNameFromProjectId(value);
        }
        // Build the path for the current breadcrumb item
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        // Check if it's the last breadcrumb (active page)
        const isLast = index === pathnames.length - 1;
        const upperCaseValue = value.charAt(0).toUpperCase() + value.slice(1);

        // For the resource part of path, we actually want to go back to project details page
        // but with the hashtag identifying which tab should be active
        // TODO: Add tab state based on URL
        if (
          [
            'services',
            'databases',
            'datastores',
            'deployments',
            'packages',
          ].includes(value)
        ) {
          const previousTo = `/${pathnames.slice(0, index).join('/')}?tab=${value}`;
          return (
            <BopmaticLink to={previousTo} key={previousTo}>
              {upperCaseValue}
            </BopmaticLink>
          );
        }

        return isLast ? (
          <Typography color="text.primary" key={to}>
            {value}
          </Typography>
        ) : (
          <BopmaticLink to={to} key={to}>
            {value}
          </BopmaticLink>
        );
      })}
    </Breadcrumbs>
  );
};

export default BopmaticBreadcrumbs;
