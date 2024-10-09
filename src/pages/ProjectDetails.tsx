import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BopmaticBreadcrumbs from '../components/breadcrumbs/BopmaticBreadcrumbs';
import { ColoredIconColumnType } from '../components/tables/utils';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PropertiesContainer, {
  KeyValuePair,
} from '../components/propertiesContainer/PropertiesContainer';
import { Tab, Tabs } from '@mui/material';
import BopmaticTabPanel from '../components/tabs/BopmaticTabPanel';
import BopmaticTableContainer from '../components/tables/BopmaticTableContainer';
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
            ? new Date(
                parseInt(projectDetails?.createTime) * 1000
              ).toDateString()
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
      ];
      setProjectProperties(props);
    }
  }, [projectDetails]);

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
      <div className="flex justify-between pt-4 pb-4">
        <h1 className="text-2xl font-bold">ArensdorfHelloWorld</h1>
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">Production</h1>
          <KeyboardArrowDownIcon fontSize="large" />
        </div>
      </div>
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
          <BopmaticTableContainer
            tableResource="Services"
            numResources={serviceNames?.length}
          >
            <ServicesTable projId={id} envId={environment?.id} />
          </BopmaticTableContainer>
        </BopmaticTabPanel>
        <BopmaticTabPanel value={value} index={1}>
          <BopmaticTableContainer
            tableResource="Databases"
            numResources={databaseNames?.length}
          >
            <DatabasesTable projId={id} envId={environment?.id} />
          </BopmaticTableContainer>
        </BopmaticTabPanel>
        <BopmaticTabPanel value={value} index={2}>
          <BopmaticTableContainer
            tableResource="Datastores"
            numResources={datastoreNames?.length}
          >
            <DatastoresTable />
          </BopmaticTableContainer>
        </BopmaticTabPanel>
        <BopmaticTabPanel value={value} index={3}>
          <BopmaticTableContainer
            tableResource="Deployments"
            numResources={deploymentIds?.length}
          >
            <DeploymentsTable projId={id} envId={environment?.id} />
          </BopmaticTableContainer>
        </BopmaticTabPanel>
        <BopmaticTabPanel value={value} index={4}>
          <BopmaticTableContainer
            tableResource="Packages [all environments]"
            numResources={packageItems?.length}
          >
            <PackagesTable projId={id} />
          </BopmaticTableContainer>
        </BopmaticTabPanel>
      </div>
    </div>
  );
};

export default ProjectDetails;
