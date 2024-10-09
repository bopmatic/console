import { useEffect } from 'react';
import BopmaticClient from '../client/client';
import { useAtom, useSetAtom } from 'jotai';
import { packagesAtom, packagesLoadingAtom } from '../atoms';
import { PackageDescription } from '../client';
import { usePackageItems } from './usePackageItems';

export const usePackages = (projectId: string | undefined) => {
  const [packagesData] = useAtom(packagesAtom); // Use the atom to read and update data
  const [packagesLoadingData] = useAtom(packagesLoadingAtom);
  const setPackagesData = useSetAtom(packagesAtom); // Another way to set data
  const setPackagesLoadingData = useSetAtom(packagesLoadingAtom);
  const packageItems = usePackageItems(projectId);

  useEffect(() => {
    const fetchData = async () => {
      const packages: PackageDescription[] = [];
      try {
        // const listPackagesResponse = await BopmaticClient.listPackages({
        //   projId: projectId,
        // });
        // // TODO: Figure out how to only fetch packages through pagination if this number becomes super large
        // const packageNames = listPackagesResponse.data.items;
        // console.log('Got packages back: ', listPackagesResponse.data);
        const apiCalls = [];
        if (packageItems && packageItems.length) {
          for (let i = 0; i < packageItems.length; i++) {
            apiCalls.push(
              BopmaticClient.describePackage({
                packageId: packageItems[i].packageId,
              })
            );
          }
          const allResponse = await Promise.all(apiCalls);
          console.log('packages allResponse is:', allResponse);
          for (const response of allResponse) {
            if (response.data.desc) {
              const packageDescription: PackageDescription = response.data.desc;
              packages.push(packageDescription);
            }
          }
          console.log('setting package atomdata', packages);
          setPackagesData(packages);
          setPackagesLoadingData(false);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
        setPackagesLoadingData(false);
      }
    };

    // TODO: This isn't working; its calling ListProjects twice because of LeftNav and ProjectsTable using the hook; figure out why
    // if (!projectsData && !projectsLoadingData) {
    if (packageItems && !packagesData && !packagesLoadingData && projectId) {
      // Only fetch if the data isn't already loaded
      // setProjectLoadingAtom(true);
      fetchData();
      setPackagesLoadingData(true);
    }
  }, [
    packageItems,
    packagesData,
    packagesLoadingData,
    projectId,
    setPackagesData,
    setPackagesLoadingData,
  ]); // Re-run if `setAtomData` changes or if `apiData` is null

  return packagesData;
};
