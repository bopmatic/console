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
  const [apiHealthArr, isLoading] = useServiceHealth(
    envId,
    projectId,
    serviceNames
  );
  useEffect(() => {
    if (apiHealthArr && apiHealthArr.length) {
      setProjectHealth(evaluateOverallHealth(apiHealthArr));
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [apiHealthArr]);
  return [projectHealth, isLoading];
};