import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BopmaticBreadcrumbs from '../components/breadcrumbs/BopmaticBreadcrumbs';
import { ColoredIconColumnType } from '../components/tables/utils';
import PropertiesContainer, {
  KeyValuePair,
} from '../components/propertiesContainer/PropertiesContainer';
import { Tab, Tabs } from '@mui/material';
import BopmaticTabPanel from '../components/tabs/BopmaticTabPanel';
import ServicesTable from '../components/tables/ServicesTable';
import DatabasesTable from '../components/tables/DatabasesTable';
import DatastoresTable from '../components/tables/DatastoresTable';
import DeploymentsTable from '../components/tables/DeploymentsTable';
import PackagesTable from '../components/tables/PackagesTable';
import { useProject } from '../hooks/useProject';
import { useEnvironment } from '../hooks/useEnvironment';
import { useServiceNames } from '../hooks/useServiceNames';
import { useDatabaseNames } from '../hooks/useDatabaseNames';
import { useDatastoreNames } from '../hooks/useDatastoreNames';
import { useDeploymentIds } from '../hooks/useDeploymentIds';
import { usePackageItems } from '../hooks/usePackageItems';
import PageHeader from '../components/pageHeader/pageHeader';
import { bopmaticDateFormat } from '../components/utils/dateUtils';
import { useProjectSite } from '../hooks/useProjectSite';

const ProjectDetails: React.FC = () => {
  const { id } = useParams();
  const environment = useEnvironment();
  const projectDetails = useProject(id);
  const [projectProperties, setProjectProperties] = useState<KeyValuePair[]>(
    []
  );
  const serviceNames = useServiceNames(id, environment?.id);
  const databaseNames = useDatabaseNames(id, environment?.id);
  const datastoreNames = useDatastoreNames(id, environment?.id);
  const deploymentIds = useDeploymentIds(id, environment?.id);
  const packageItems = usePackageItems(id);
  const [site, isSiteLoading] = useProjectSite(id, environment?.id);

  useEffect(() => {
    if (projectDetails) {
      const props: KeyValuePair[] = [
        {
          key: 'Production state',
          value: 'Healthy',
          isColoredIcon: true,
          coloredIconColumnType: ColoredIconColumnType.PROJECT_HEALTH,
        },
        {
          key: 'Project state',
          value: projectDetails?.state,
          isColoredIcon: true,
          coloredIconColumnType: ColoredIconColumnType.PROJECT_STATE,
        },
        {
          key: 'Project ID',
          value: projectDetails?.id,
        },
        {
          key: 'Creation date',
          value: projectDetails?.createTime
            ? bopmaticDateFormat(
                new Date(parseInt(projectDetails?.createTime) * 1000)
              )
            : undefined,
        },
        {
          key: 'DNS Prefix',
          value: projectDetails?.header?.dnsPrefix,
        },
        {
          key: 'DNS Domain',
          value: projectDetails?.header?.dnsDomain,
        },
        {
          key: 'Project Site',
          value: site,
          linkTo: site,
        },
      ];
      setProjectProperties(props);
    }
  }, [projectDetails, site]);

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const a11yProps = (index: number) => {
    return {
      id: `project-details-tab-${index}`,
      'aria-controls': `project-details-tabpanel-${index}`,
    };
  };

  return (
    <div>
      <BopmaticBreadcrumbs />
      <PageHeader title={projectDetails?.header?.name} />
      <div className="pb-6">
        <PropertiesContainer keyValuePairs={projectProperties} />
      </div>
      <div className="w-full">
        <div className="border-b border-bopgrey">
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            sx={{
              '.Mui-selected': { color: '#A06603' },
              '.MuiTabs-indicator': { backgroundColor: '#A06603' },
            }}
          >
            <Tab
              // label="Services (6)"
              label={
                serviceNames ? `Service (${serviceNames.length})` : 'Services'
              }
              {...a11yProps(0)}
              sx={{
                '&.Mui-selected': { color: '#A06603' },
                paddingLeft: '2rem',
                paddingRight: '2rem',
              }}
            />
            <Tab
              label={
                databaseNames
                  ? `Databases (${databaseNames.length})`
                  : 'Databases'
              }
              {...a11yProps(1)}
              sx={{
                '&.Mui-selected': { color: '#A06603' },
                paddingLeft: '2rem',
                paddingRight: '2rem',
              }}
            />
            <Tab
              label={
                datastoreNames
                  ? `Datastores (${datastoreNames.length})`
                  : 'Datastores'
              }
              {...a11yProps(2)}
              sx={{
                '&.Mui-selected': { color: '#A06603' },
                paddingLeft: '2rem',
                paddingRight: '2rem',
              }}
            />
            <Tab
              label={
                deploymentIds
                  ? `Deployments (${deploymentIds.length})`
                  : 'Deployments'
              }
              {...a11yProps(3)}
              sx={{
                '&.Mui-selected': { color: '#A06603' },
                paddingLeft: '2rem',
                paddingRight: '2rem',
              }}
            />
            <Tab
              label={
                packageItems
                  ? `Packages [all environments] (${packageItems.length})`
                  : 'Packages [all environments]'
              }
              {...a11yProps(4)}
              sx={{
                '&.Mui-selected': { color: '#A06603' },
                paddingLeft: '2rem',
                paddingRight: '2rem',
              }}
            />
          </Tabs>
        </div>
        <BopmaticTabPanel value={value} index={0}>
          <ServicesTable projId={id} envId={environment?.id} />
        </BopmaticTabPanel>
        <BopmaticTabPanel value={value} index={1}>
          <DatabasesTable projId={id} envId={environment?.id} />
        </BopmaticTabPanel>
        <BopmaticTabPanel value={value} index={2}>
          <DatastoresTable projId={id} envId={environment?.id} />
        </BopmaticTabPanel>
        <BopmaticTabPanel value={value} index={3}>
          <DeploymentsTable projId={id} envId={environment?.id} />
        </BopmaticTabPanel>
        <BopmaticTabPanel value={value} index={4}>
          <PackagesTable projId={id} />
        </BopmaticTabPanel>
      </div>
    </div>
  );
};

export default ProjectDetails;
