import { useEffect } from 'react';
import { getBopmaticClient } from '../client/client';
import { useAtom, useSetAtom } from 'jotai';
import { deploymentsAtom, deploymentsLoadingAtom } from '../atoms';
import { DeploymentDescription } from '../client';
import { useDeploymentIds } from './useDeploymentIds';

export const useDeployments = (
  projectId: string | undefined,
  envId: string | undefined
) => {
  const [deploymentsData] = useAtom(deploymentsAtom); // Use the atom to read and update data
  const projectDeploymentsData = deploymentsData?.filter(
    (d) => d.header?.projId === projectId
  );
  const setDeploymentsData = useSetAtom(deploymentsAtom); // Another way to set data
  const setDeploymentsLoadingData = useSetAtom(deploymentsLoadingAtom);
  const deploymentIds = useDeploymentIds(projectId, envId);

  useEffect(() => {
    const fetchData = async () => {
      const deployments: DeploymentDescription[] = [];
      try {
        const apiCalls = [];
        if (deploymentIds && deploymentIds.length) {
          for (let i = 0; i < deploymentIds.length; i++) {
            apiCalls.push(
              getBopmaticClient().describeDeployment({
                id: deploymentIds[i],
              })
            );
          }
          const allResponse = await Promise.all(apiCalls);
          for (const response of allResponse) {
            if (response.data.desc) {
              const deploymentDescription: DeploymentDescription =
                response.data.desc;
              deployments.push(deploymentDescription);
            }
          }
          setDeploymentsData(
            deploymentsData
              ? [...deploymentsData, ...deployments]
              : [...deployments]
          );
          setDeploymentsLoadingData(false);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
        setDeploymentsLoadingData(false);
      }
    };

    if (
      deploymentIds &&
      deploymentIds.length &&
      !projectDeploymentsData?.length &&
      projectId &&
      envId
    ) {
      // Only fetch if the data isn't already loaded
      fetchData();
      setDeploymentsLoadingData(true);
    }
  }, [
    deploymentIds,
    deploymentsData,
    envId,
    projectDeploymentsData?.length,
    projectId,
    setDeploymentsData,
    setDeploymentsLoadingData,
  ]); // Re-run if `setAtomData` changes or if `apiData` is null

  return projectDeploymentsData;
};
