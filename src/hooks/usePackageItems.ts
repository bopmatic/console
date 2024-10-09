import { useEffect } from 'react';
import BopmaticClient from '../client/client';
import { useAtom, useSetAtom } from 'jotai';
import { packageIdsAtom } from '../atoms';

export const usePackageItems = (projectId: string | undefined) => {
  const [packageIdsData] = useAtom(packageIdsAtom); // Use the atom to read and update data
  const setPackageIdsData = useSetAtom(packageIdsAtom); // Another way to set data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const listPackagesResponse = await BopmaticClient.listPackages({
          projId: projectId,
        });
        const packageItems = listPackagesResponse.data.items;
        if (packageItems && packageItems.length) {
          console.log('setting packageItems atom:', packageItems);
          setPackageIdsData(packageItems);
        } else {
          // we got a response but no data, implying its empty
          setPackageIdsData([]);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };

    // TODO: This isn't working; its calling ListProjects twice because of LeftNav and ProjectsTable using the hook; figure out why
    // if (!projectsData && !projectsLoadingData) {
    if (!packageIdsData && projectId) {
      // Only fetch if the data isn't already loaded
      // setProjectLoadingAtom(true);
      fetchData();
    }
  }, [projectId, packageIdsData, setPackageIdsData]); // Re-run if `setAtomData` changes or if `apiData` is null

  return packageIdsData;
};
