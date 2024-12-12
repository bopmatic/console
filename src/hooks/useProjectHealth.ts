import { ApiHealth } from '../atoms';
import { useServiceHealth } from './useServiceHealth';
import { useEffect, useState } from 'react';
import { evaluateOverallHealth } from './utils';
import { useServiceNames } from './useServiceNames';

export const useProjectHealth = (
  envId: string | undefined,
  projectId: string | undefined
): [ApiHealth | undefined, boolean] => {
  const [projectHealth, setProjectHealth] = useState<ApiHealth | undefined>(
    undefined
  );
  const serviceNames = useServiceNames(projectId, envId);
  const [isStaticProject, setIsStaticProject] = useState(false);
  const [apiHealthArr, isLoading] = useServiceHealth(
    envId,
    projectId,
    serviceNames
  );
  useEffect(() => {
    if (serviceNames && serviceNames.length === 0) {
      // This is a project that doesn't have services, such as static site.
      // In this case, we want to just hard-code this to Healthy. Later, we can
      // look into CloudFront logs or other mechanisms based on the type of project.
      setIsStaticProject(true);
    } else if (apiHealthArr && apiHealthArr.length) {
      setProjectHealth(evaluateOverallHealth(apiHealthArr));
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [apiHealthArr]);
  return isStaticProject
    ? [ApiHealth.HEALTHY, false]
    : [projectHealth, isLoading];
};
