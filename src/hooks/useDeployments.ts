import { useEffect } from 'react';
import BopmaticClient from '../client/client';
import { useAtom, useSetAtom } from 'jotai';
import { deploymentsAtom, deploymentsLoadingAtom } from '../atoms';
import { DeploymentDescription } from '../client';
import { useDeploymentIds } from './useDeploymentIds';

export const useDeployments = (
  projectId: string | undefined,
  envId: string | undefined
) => {
  const [deploymentsData] = useAtom(deploymentsAtom); // Use the atom to read and update data
  const [deploymentsLoadingData] = useAtom(deploymentsLoadingAtom);
  const setDeploymentsData = useSetAtom(deploymentsAtom); // Another way to set data
  const setDeploymentsLoadingData = useSetAtom(deploymentsLoadingAtom);
  const deploymentIds = useDeploymentIds(projectId, envId);

  useEffect(() => {
    const fetchData = async () => {
      const deployments: DeploymentDescription[] = [];
      try {
        // const listDeploymentsResponse = await BopmaticClient.listDeployments({
        //   projEnvHeader: {
        //     projId: projectId,
        //     envId: envId,
        //   },
        // });
        // // TODO: Figure out how to only fetch deployments through pagination if this number becomes super large
        // const deploymentNames = listDeploymentsResponse.data.ids;
        // console.log('Got deployments back: ', listDeploymentsResponse.data);
        const apiCalls = [];
        if (deploymentIds && deploymentIds.length) {
          for (let i = 0; i < deploymentIds.length; i++) {
            apiCalls.push(
              BopmaticClient.describeDeployment({
                id: deploymentIds[i],
              })
            );
          }
          const allResponse = await Promise.all(apiCalls);
          console.log('deployments allResponse is:', allResponse);
          for (const response of allResponse) {
            if (response.data.desc) {
              const deploymentDescription: DeploymentDescription =
                response.data.desc;
              deployments.push(deploymentDescription);
            }
          }
          console.log('setting deployment atomdata', deployments);
          setDeploymentsData(deployments);
          setDeploymentsLoadingData(false);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
        setDeploymentsLoadingData(false);
      }
    };

    // TODO: This isn't working; its calling ListProjects twice because of LeftNav and ProjectsTable using the hook; figure out why
    // if (!projectsData && !projectsLoadingData) {
    if (
      deploymentIds &&
      !deploymentsData &&
      !deploymentsLoadingData &&
      projectId &&
      envId
    ) {
      // Only fetch if the data isn't already loaded
      // setProjectLoadingAtom(true);
      fetchData();
      setDeploymentsLoadingData(true);
    }
  }, [
    deploymentIds,
    deploymentsData,
    deploymentsLoadingData,
    envId,
    projectId,
    setDeploymentsData,
    setDeploymentsLoadingData,
  ]); // Re-run if `setAtomData` changes or if `apiData` is null

  return deploymentsData;
};
