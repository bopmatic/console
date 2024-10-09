import { useEffect, useState } from 'react';
import { EnvironmentDescription } from '../client';
import { useEnvironments } from './useEnvironments';

/**
 * This hook will provide the default environment (currently just Prod)
 * It is up to the components to keep local state about which environment a particular page is using
 */
export const useEnvironment = () => {
  const envsData = useEnvironments();
  const [envData, setEnvData] = useState<EnvironmentDescription>();

  useEffect(() => {
    console.log('inside useProject hook with projectsData', envsData);
    if (envsData) {
      const env = envsData.filter((env) => env.header?.name === 'prod')[0];
      setEnvData(env);
    }
  }, [envsData]);

  return envData;
};
