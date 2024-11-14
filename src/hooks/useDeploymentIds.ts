import { useEffect } from 'react';
import { getBopmaticClient } from '../client/client';
import { useAtom, useSetAtom } from 'jotai';
import { ProjectDeploymentIds, projectDeploymentIdsAtom } from '../atoms';

export const useDeploymentIds = (
  projectId: string | undefined,
  envId: string | undefined
): Array<string> | undefined => {
  const [projectDeploymentIdsData] = useAtom(projectDeploymentIdsAtom); // Use the atom to read and update data
  // if deploymentIdDataFilteredByProject it means we haven't yet called listServices for that projectId
  const deploymentIdDataFilteredByProject = projectDeploymentIdsData?.filter(
    (p) => p.projectId === projectId
  );
  const setProjectDeploymentIdsData = useSetAtom(projectDeploymentIdsAtom); // Another way to set data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const listDeploymentsResponse =
          await getBopmaticClient().listDeployments({
            projEnvHeader: {
              projId: projectId,
              envId: envId,
            },
          });
        const deploymentIds = listDeploymentsResponse.data.ids;
        let projectDeploymentIds: ProjectDeploymentIds;
        if (deploymentIds && deploymentIds.length) {
          projectDeploymentIds = {
            projectId: projectId,
            deploymentIds: deploymentIds,
          };
        } else {
          // we got a response but no data, implying its empty
          projectDeploymentIds = {
            projectId: projectId,
            deploymentIds: [],
          };
        }
        setProjectDeploymentIdsData(
          !projectDeploymentIdsData
            ? [projectDeploymentIds]
            : [...projectDeploymentIdsData, projectDeploymentIds]
        );
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };

    // TODO: This isn't working; its calling ListProjects twice because of LeftNav and ProjectsTable using the hook; figure out why
    // if (!projectsData && !projectsLoadingData) {
    if (!deploymentIdDataFilteredByProject?.length && projectId && envId) {
      // Only fetch if the data isn't already loaded
      // setProjectLoadingAtom(true);
      fetchData();
    }
  }, [
    envId,
    projectId,
    projectDeploymentIdsData,
    setProjectDeploymentIdsData,
    deploymentIdDataFilteredByProject?.length,
  ]); // Re-run if `setAtomData` changes or if `apiData` is null

  // Undefined means we haven't yet made the ListServices API call yet for this projectId
  return deploymentIdDataFilteredByProject &&
    deploymentIdDataFilteredByProject.length
    ? deploymentIdDataFilteredByProject[0].deploymentIds
    : undefined;
};
