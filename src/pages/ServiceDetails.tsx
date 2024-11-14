import React, { useEffect, useState } from 'react';
import BopmaticBreadcrumbs from '../components/breadcrumbs/BopmaticBreadcrumbs';
import PageHeader from '../components/pageHeader/pageHeader';
import { useServices } from '../hooks/useServices';
import { useParams } from 'react-router-dom';
import { useEnvironment } from '../hooks/useEnvironment';
import PropertiesContainer, {
  KeyValuePair,
} from '../components/propertiesContainer/PropertiesContainer';
import { ColoredIconColumnType } from '../components/tables/utils';
import RpcEndpointsTable from '../components/tables/RpcEndpointsTable';
import Grid from '@mui/material/Grid2';
import DatabasesTable from '../components/tables/DatabasesTable';
import DatastoresTable from '../components/tables/DatastoresTable';
import LineChart from '../components/lineChart/LineChart';
import { useMetrics } from '../hooks/useMetrics';
import {
  getMetricsEndWindowForEnum,
  getMetricsSamplingPeriodForEnum,
  LINE_CHART_OPTIONS,
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
  useEffect(() => {
    console.log('p100MetricsData:', p100MetricsData);
  }, [p100MetricsData]);
  /*
  TODO THURSDAY:
  1. Create fake data with null values for the given time period as seen below
  2. Create a "day" version of the options constant and use it when time selector is 7 days or 30 days
   */
  const date24HoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
  const labels = ['2024-11-13T21:55:00.000Z', '2024-11-13T22:25:00.000Z'];
  const data = ['9726.55', '5701.19'];

  // Generate hourly timestamps and `null` data placeholders
  const hourlyTimestamps = [];
  const hourlyData = [];
  for (let i = 0; i <= 24; i++) {
    const date = new Date(date24HoursAgo.getTime() + i * 60 * 60 * 1000);
    hourlyTimestamps.push(date.toISOString());
    hourlyData.push(null); // Add `null` for each new hourly timestamp
  }

  // Merge labels and data arrays with hourly timestamps and `null` data, respectively
  const combinedLabels = [...labels, ...hourlyTimestamps];
  const combinedData = [...data, ...hourlyData];

  // Sort combined arrays based on chronological order of labels
  const sortedIndices = combinedLabels
    .map((label, index) => ({ label, data: combinedData[index], index }))
    .sort((a, b) => new Date(a.label).getTime() - new Date(b.label).getTime());

  // Extract sorted labels and data
  const sortedLabels = sortedIndices.map((item) => item.label);
  const sortedData = sortedIndices.map((item) => item.data);
  const TESTMETRICS = {
    labels: sortedLabels,
    datasets: [
      {
        data: sortedData,
        label: 'GetOrder',
        borderColor: '#FBA919',
        backgroundColor: '#FBA919',
      },
      {
        data: sortedData,
        label: 'PlaceOrder',
        borderColor: '#228B22',
        backgroundColor: '#228B22',
      },
    ],
  };
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
          value: 'Healthy',
          isColoredIcon: true,
          coloredIconColumnType: ColoredIconColumnType.PROJECT_HEALTH,
        },
        {
          key: 'API definition',
          value: serviceDescription.apiDef ?? '-',
        },
        {
          key: 'Port',
          value: serviceDescription.port ?? '-',
        },
      ];
      setServiceProperties(props);
    }
  }, [serviceDescription]);

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
              />
            </div>
          </Grid>
          <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
            <div>
              <DatastoresTable
                projId={projectId}
                envId={environment?.id}
                tableDescOverride="Datastores accessed by this service"
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
            options={LINE_CHART_OPTIONS}
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
            options={LINE_CHART_OPTIONS}
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
            options={LINE_CHART_OPTIONS}
            currTime={numRequestsTime}
            setCurrTime={setNumRequestsTime}
            isLoading={totalRequestsDataLoading}
            errorText={totalRequestsErrorText}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
          <LineChart
            chartName="5xx Count"
            yAxisLabel="Num. 5xx"
            data={errorsMetricsData}
            options={LINE_CHART_OPTIONS}
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
