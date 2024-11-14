import { useEffect } from 'react';
import { getBopmaticClient } from '../client/client';
import { useAtom, useSetAtom } from 'jotai';
import { ProjectPackageIds, projectPackageIdsAtom } from '../atoms';

export const usePackageItems = (projectId: string | undefined) => {
  const [projectPackageIdsData] = useAtom(projectPackageIdsAtom); // Use the atom to read and update data
  // if packageIdsDataFilteredByProject it means we haven't yet called listServices for that projectId
  const packageIdsDataFilteredByProject = projectPackageIdsData?.filter(
    (p) => p.projectId === projectId
  );
  const setProjectPackageIdsData = useSetAtom(projectPackageIdsAtom); // Another way to set data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const listPackagesResponse = await getBopmaticClient().listPackages({
          projId: projectId,
        });
        const packageItems = listPackagesResponse.data.items;
        let projectPackageIds: ProjectPackageIds;
        if (packageItems && packageItems.length) {
          projectPackageIds = {
            projectId: projectId,
            packageItems: packageItems,
          };
        } else {
          // we got a response but no data, implying its empty
          projectPackageIds = {
            projectId: projectId,
            packageItems: [],
          };
        }
        setProjectPackageIdsData(
          !projectPackageIdsData
            ? [projectPackageIds]
            : [...projectPackageIdsData, projectPackageIds]
        );
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };

    if (!packageIdsDataFilteredByProject?.length && projectId) {
      // Only fetch if the data isn't already loaded
      // setProjectLoadingAtom(true);
      fetchData();
    }
  }, [
    packageIdsDataFilteredByProject?.length,
    projectId,
    projectPackageIdsData,
    setProjectPackageIdsData,
  ]); // Re-run if `setAtomData` changes or if `apiData` is null

  // Undefined means we haven't yet made the ListServices API call yet for this projectId
  return packageIdsDataFilteredByProject &&
    packageIdsDataFilteredByProject.length
    ? packageIdsDataFilteredByProject[0].packageItems
    : undefined;
};
