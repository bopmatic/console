import React, { useEffect, useState } from 'react';
import BopmaticBreadcrumbs from '../components/breadcrumbs/BopmaticBreadcrumbs';
import PageHeader from '../components/pageHeader/pageHeader';
import PropertiesContainer, {
  KeyValuePair,
} from '../components/propertiesContainer/PropertiesContainer';
import { useParams } from 'react-router-dom';
import { useEnvironment } from '../hooks/useEnvironment';
import { useDeployments } from '../hooks/useDeployments';
import { ColoredIconColumnType } from '../components/tables/utils';
import { bopmaticDateFormat } from '../components/utils/dateUtils';

const DeploymentDetails: React.FC = () => {
  const { projectId, deploymentId } = useParams();
  const environment = useEnvironment();
  const deployments = useDeployments(projectId, environment?.id);
  const deploymentsDescriptionFiltered = deployments?.filter(
    (d) => d.id === deploymentId
  );
  const deploymentDescription = deploymentsDescriptionFiltered?.length
    ? deploymentsDescriptionFiltered[0]
    : undefined;
  const [deploymentProperties, setDeploymentProperties] = useState<
    KeyValuePair[]
  >([]);

  useEffect(() => {
    if (deploymentDescription) {
      const props: KeyValuePair[] = [
        {
          key: 'Deployment state',
          value: deploymentDescription.state,
          isColoredIcon: true,
          coloredIconColumnType: ColoredIconColumnType.DEPLOYMENT_STATE,
        },
        {
          key: 'Deployment details',
          value:
            deploymentDescription.stateDetail === 'NONE'
              ? '-'
              : deploymentDescription.stateDetail,
        },
        {
          key: 'Environment',
          value: deploymentDescription.header?.envId,
        },
        {
          key: 'Package ID',
          value: deploymentDescription.header?.pkgId,
          linkTo: `/projects/${projectId}/packages/${deploymentDescription.header?.pkgId}`,
        },
        {
          key: 'Initiator',
          value: deploymentDescription.header?.initiator,
        },
        {
          key: 'Creation date',
          value: deploymentDescription.createTime
            ? bopmaticDateFormat(
                new Date(parseInt(deploymentDescription.createTime))
              )
            : '-',
        },
        {
          key: 'Validation date',
          value: deploymentDescription.validationStartTime
            ? bopmaticDateFormat(
                new Date(parseInt(deploymentDescription.validationStartTime))
              )
            : '-',
        },
        {
          key: 'Build start date',
          value: deploymentDescription.buildStartTime
            ? bopmaticDateFormat(
                new Date(parseInt(deploymentDescription.buildStartTime))
              )
            : '-',
        },
        {
          key: 'Deploy start',
          value: deploymentDescription.deployStartTime
            ? bopmaticDateFormat(
                new Date(parseInt(deploymentDescription.deployStartTime))
              )
            : '-',
        },
        {
          key: 'Type',
          value: deploymentDescription.header?.type,
        },
      ];
      setDeploymentProperties(props);
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [deploymentDescription]);
  return (
    <div>
      <BopmaticBreadcrumbs />
      <PageHeader
        title={`Deployment ID: ${deploymentId}`}
        hideEnvironment={true}
      />
      <div>
        <PropertiesContainer keyValuePairs={deploymentProperties} />
      </div>
    </div>
  );
};

export default DeploymentDetails;
