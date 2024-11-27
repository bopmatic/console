import React, { useEffect, useState } from 'react';
import BopmaticBreadcrumbs from '../components/breadcrumbs/BopmaticBreadcrumbs';
import PageHeader from '../components/pageHeader/pageHeader';
import { useServices } from '../hooks/useServices';
import { useParams } from 'react-router-dom';
import { useEnvironment } from '../hooks/useEnvironment';
import PropertiesContainer, {
  KeyValuePair,
} from '../components/propertiesContainer/PropertiesContainer';
import RpcEndpointsTable from '../components/tables/RpcEndpointsTable';
import Grid from '@mui/material/Grid2';
import DatabasesTable from '../components/tables/DatabasesTable';
import DatastoresTable from '../components/tables/DatastoresTable';
import LineChart from '../components/lineChart/LineChart';
import { useMetrics } from '../hooks/useMetrics';
import {
  getChartJsOptionsForEnum,
  getMetricsEndWindowForEnum,
  getMetricsSamplingPeriodForEnum,
  TIME_TYPE,
} from '../components/lineChart/utils';

const ServiceDetails: React.FC = () => {
  const { projectId, serviceName } = useParams();
  const environment = useEnvironment();
  const services = useServices(projectId, environment?.id);
  const serviceDescriptionFiltered = services?.filter(
    (s) => s.svcHeader?.serviceName === serviceName
  );
  const serviceDescription = serviceDescriptionFiltered?.length
    ? serviceDescriptionFiltered[0]
    : undefined;
  const [serviceProperties, setServiceProperties] = useState<KeyValuePair[]>(
    []
  );
  const [p100Time, setP100Time] = React.useState<TIME_TYPE>(
    TIME_TYPE.LAST_24_HOURS
  );
  const [p50Time, setP50Time] = React.useState<TIME_TYPE>(
    TIME_TYPE.LAST_24_HOURS
  );
  const [numRequestsTime, setNumRequestsTime] = React.useState<TIME_TYPE>(
    TIME_TYPE.LAST_24_HOURS
  );
  const [totalErrorsTime, setTotalErrorsTime] = React.useState<TIME_TYPE>(
    TIME_TYPE.LAST_24_HOURS
  );
  // TODO: Get these from time dropdown options
  const end = new Date();
  const [p100MetricsData, p100DataLoading, p100ErrorText] = useMetrics(
    projectId,
    environment?.id,
    getMetricsEndWindowForEnum(p100Time),
    end,
    ['DurationMS'],
    'service_',
    ['api'], // TODO: Create enums with these values since they are consistent depending on page and resource type
    false,
    getMetricsSamplingPeriodForEnum(p100Time),
    'METRIC_SCOPE_SERVICE',
    serviceName,
    '1.0'
  );
  const [p50MetricsData, p50DataLoading, p50ErrorText] = useMetrics(
    projectId,
    environment?.id,
    getMetricsEndWindowForEnum(p50Time),
    end,
    ['DurationMS'],
    'service_',
    ['api'], // TODO: Create enums with these values since they are consistent depending on page and resource type
    false,
    getMetricsSamplingPeriodForEnum(p50Time),
    'METRIC_SCOPE_SERVICE',
    serviceName,
    '0.5'
  );
  const [
    totalRequestsMetricsData,
    totalRequestsDataLoading,
    totalRequestsErrorText,
  ] = useMetrics(
    projectId,
    environment?.id,
    getMetricsEndWindowForEnum(numRequestsTime),
    end,
    ['Invocations'],
    'service_',
    ['api'], // TODO: Create enums with these values since they are consistent depending on page and resource type
    false,
    getMetricsSamplingPeriodForEnum(numRequestsTime),
    'METRIC_SCOPE_SERVICE',
    serviceName
  );
  const [errorsMetricsData, errorsDataLoading, errorsErrorText] = useMetrics(
    projectId,
    environment?.id,
    getMetricsEndWindowForEnum(totalErrorsTime),
    end,
    ['Errors'],
    'service_',
    ['api'], // TODO: Create enums with these values since they are consistent depending on page and resource type
    false,
    getMetricsSamplingPeriodForEnum(totalErrorsTime),
    'METRIC_SCOPE_SERVICE',
    serviceName
  );

  useEffect(() => {
    if (serviceDescription) {
      const props: KeyValuePair[] = [
        {
          key: 'Service health',
          value: '',
          healthTableCellProps: {
            envId: environment?.id,
            projectId,
            serviceName,
          },
        },
        {
          key: 'API definition',
          value: serviceDescription.apiDef ?? '-',
        },
        {
          key: 'Port',
          value: serviceDescription.port ?? '-',
        },
        {
          key: 'Logs',
          value: 'View logs',
          linkTo: `/logs?projectId=${projectId}&serviceName=${serviceName}`,
        },
      ];
      setServiceProperties(props);
    }
  }, [environment?.id, projectId, serviceDescription, serviceName]);

  return (
    <div>
      <BopmaticBreadcrumbs />
      <PageHeader title={serviceName} />
      <div className="pb-6">
        <PropertiesContainer keyValuePairs={serviceProperties} />
      </div>
      <RpcEndpointsTable
        projId={projectId}
        envId={environment?.id}
        serviceName={serviceName}
      />
      <div className="mt-4">
        <Grid
          container
          spacing={2}
          columns={{ xs: 6, sm: 6, md: 6, lg: 12, xl: 12 }}
        >
          <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
            <div>
              <DatabasesTable
                projId={projectId}
                envId={environment?.id}
                tableDescOverride="Databases accessed by this service"
                databaseNamesFilter={serviceDescription?.databaseNames}
              />
            </div>
          </Grid>
          <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
            <div>
              <DatastoresTable
                projId={projectId}
                envId={environment?.id}
                tableDescOverride="Datastores accessed by this service"
                datastoreNamesFilter={serviceDescription?.datastoreNames}
              />
            </div>
          </Grid>
        </Grid>
      </div>
      <h2 className="pt-6 pb-4">Metrics</h2>
      <Grid
        container
        spacing={2}
        columns={{ xs: 6, sm: 6, md: 6, lg: 12, xl: 12 }}
      >
        <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
          <LineChart
            chartName="API Latency (p100)"
            yAxisLabel="milliseconds"
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            data={p100MetricsData}
            options={getChartJsOptionsForEnum(p100Time)}
            currTime={p100Time}
            setCurrTime={setP100Time}
            isLoading={p100DataLoading}
            errorText={p100ErrorText}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
          <LineChart
            chartName="API Latency (p50)"
            yAxisLabel="milliseconds"
            data={p50MetricsData}
            options={getChartJsOptionsForEnum(p50Time)}
            currTime={p50Time}
            setCurrTime={setP50Time}
            isLoading={p50DataLoading}
            errorText={p50ErrorText}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
          <LineChart
            chartName="Total API Requests"
            yAxisLabel="Num. requests"
            data={totalRequestsMetricsData}
            options={getChartJsOptionsForEnum(numRequestsTime)}
            currTime={numRequestsTime}
            setCurrTime={setNumRequestsTime}
            isLoading={totalRequestsDataLoading}
            errorText={totalRequestsErrorText}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
          <LineChart
            chartName="Error count"
            yAxisLabel="Num. errors"
            data={errorsMetricsData}
            options={getChartJsOptionsForEnum(totalErrorsTime)}
            currTime={totalErrorsTime}
            setCurrTime={setTotalErrorsTime}
            isLoading={errorsDataLoading}
            errorText={errorsErrorText}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default ServiceDetails;
