import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PropertiesContainer, {
  KeyValuePair,
} from '../components/propertiesContainer/PropertiesContainer';
import { usePackages } from '../hooks/usePackages';
import { ColoredIconColumnType } from '../components/tables/utils';
import BopmaticBreadcrumbs from '../components/breadcrumbs/BopmaticBreadcrumbs';
import PageHeader from '../components/pageHeader/pageHeader';
import DeploymentsByPackageTable from '../components/tables/DeploymentsByPackageTable';
import { formatBytes } from '../components/utils/byteUtils';
import { bopmaticDateFormat } from '../components/utils/dateUtils';

const PackageDetails: React.FC = () => {
  const { projectId, packageId } = useParams();
  const packages = usePackages(projectId);
  const packagesFiltered = packages?.filter((s) => s.packageId === packageId);
  const packageDescription = packagesFiltered?.length
    ? packagesFiltered[0]
    : undefined;
  const [packageProperties, setPackageProperties] = useState<KeyValuePair[]>(
    []
  );

  useEffect(() => {
    if (packageDescription) {
      const props: KeyValuePair[] = [
        {
          key: 'Package state',
          value: packageDescription.state,
          isColoredIcon: true,
          coloredIconColumnType: ColoredIconColumnType.PACKAGE_STATE,
        },
        {
          key: 'Project',
          value: packageDescription.projId,
        },
        {
          key: 'Package size',
          value: packageDescription.packageSize
            ? formatBytes(parseInt(packageDescription.packageSize))
            : '-',
        },
        {
          key: 'Upload date',
          value: packageDescription.uploadTime
            ? bopmaticDateFormat(
                new Date(parseInt(packageDescription.uploadTime))
              )
            : '-',
        },
      ];
      setPackageProperties(props);
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [packageDescription]);

  return (
    <div>
      <BopmaticBreadcrumbs />
      <PageHeader title={`Package ID: ${packageId}`} hideEnvironment={true} />
      <div className="pb-6">
        <PropertiesContainer keyValuePairs={packageProperties} />
      </div>
      <DeploymentsByPackageTable projId={projectId} packageId={packageId} />
    </div>
  );
};

export default PackageDetails;
