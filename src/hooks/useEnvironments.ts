import { useEffect } from 'react';
import { EnvironmentDescription } from '../client';
import { useAtom, useSetAtom } from 'jotai/index';
import { environmentsAtom, environmentsLoadingAtom } from '../atoms';
import BopmaticClient from '../client/client';

export const useEnvironments = () => {
  const [environmentsData] = useAtom(environmentsAtom); // Use the atom to read and update data
  const [environmentsLoading] = useAtom(environmentsLoadingAtom);
  const setEnvironmentsData = useSetAtom(environmentsAtom); // Another way to set data
  const setEnvironmentsLoading = useSetAtom(environmentsLoadingAtom);

  useEffect(() => {
    const fetchData = async () => {
      const envs: EnvironmentDescription[] = [];
      try {
        const listEnvsResponse = await BopmaticClient.listEnvironments({});
        const envIds = listEnvsResponse.data.ids;
        const apiCalls = [];
        if (envIds && envIds.length) {
          for (let i = 0; i < envIds.length; i++) {
            apiCalls.push(
              BopmaticClient.describeEnvironment({
                id: envIds[i],
              })
            );
          }
          const allResponse = await Promise.all(apiCalls);
          for (const response of allResponse) {
            if (response.data.desc) {
              const envDesc: EnvironmentDescription = response.data.desc;
              envs.push(envDesc);
            }
          }
          setEnvironmentsData(envs);
          setEnvironmentsLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
        setEnvironmentsLoading(false);
      }
    };

    if (!environmentsData && !environmentsLoading) {
      // Only fetch if the data isn't already loaded
      setEnvironmentsLoading(true);
      fetchData();
    }
  }, [
    environmentsData,
    environmentsLoading,
    setEnvironmentsData,
    setEnvironmentsLoading,
  ]); // Re-run if `setAtomData` changes or if `apiData` is null

  return environmentsData;
};
