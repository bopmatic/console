import { useEffect } from 'react';
import BopmaticClient from '../client/client';
import { useAtom, useSetAtom } from 'jotai';
import { packagesAtom, packagesLoadingAtom } from '../atoms';
import { PackageDescription } from '../client';
import { usePackageItems } from './usePackageItems';

export const usePackages = (projectId: string | undefined) => {
  const [packagesData] = useAtom(packagesAtom); // Use the atom to read and update data
  const projectPackagesData = packagesData?.filter(
    (p) => p.projId === projectId
  );
  const [packagesLoadingData] = useAtom(packagesLoadingAtom);
  const setPackagesData = useSetAtom(packagesAtom); // Another way to set data
  const setPackagesLoadingData = useSetAtom(packagesLoadingAtom);
  const packageItems = usePackageItems(projectId);

  useEffect(() => {
    const fetchData = async () => {
      const packages: PackageDescription[] = [];
      try {
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
          for (const response of allResponse) {
            if (response.data.desc) {
              const packageDescription: PackageDescription = response.data.desc;
              packages.push(packageDescription);
            }
          }
          setPackagesData(
            packagesData ? [...packagesData, ...packages] : [...packages]
          );
          setPackagesLoadingData(false);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
        setPackagesLoadingData(false);
      }
    };

    if (
      packageItems &&
      packageItems.length &&
      !projectPackagesData?.length &&
      projectId
    ) {
      // Only fetch if the data isn't already loaded
      fetchData();
      setPackagesLoadingData(true);
    }
  }, [
    packageItems,
    packagesData,
    projectId,
    projectPackagesData?.length,
    setPackagesData,
    setPackagesLoadingData,
  ]); // Re-run if `setAtomData` changes or if `apiData` is null

  return projectPackagesData;
};
