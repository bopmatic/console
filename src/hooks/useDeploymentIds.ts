import { useEffect } from 'react';
import BopmaticClient from '../client/client';
import { useAtom, useSetAtom } from 'jotai';
import { deploymentIdsAtom } from '../atoms';

export const useDeploymentIds = (
  projectId: string | undefined,
  envId: string | undefined
) => {
  const [deploymentIdsData] = useAtom(deploymentIdsAtom); // Use the atom to read and update data
  const setDeploymentIdsData = useSetAtom(deploymentIdsAtom); // Another way to set data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const listDeploymentsResponse = await BopmaticClient.listDeployments({
          projEnvHeader: {
            projId: projectId,
            envId: envId,
          },
        });
        const deploymentIds = listDeploymentsResponse.data.ids;
        if (deploymentIds && deploymentIds.length) {
          console.log('setting deploymentIds atom:', deploymentIds);
          setDeploymentIdsData(deploymentIds);
        } else {
          // we got a response but no data, implying its empty
          setDeploymentIdsData([]);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };

    // TODO: This isn't working; its calling ListProjects twice because of LeftNav and ProjectsTable using the hook; figure out why
    // if (!projectsData && !projectsLoadingData) {
    if (!deploymentIdsData && projectId && envId) {
      // Only fetch if the data isn't already loaded
      // setProjectLoadingAtom(true);
      fetchData();
    }
  }, [envId, projectId, deploymentIdsData, setDeploymentIdsData]); // Re-run if `setAtomData` changes or if `apiData` is null

  return deploymentIdsData;
};
