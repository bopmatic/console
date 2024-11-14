import React from 'react';
import BopmaticBreadcrumbs from '../components/breadcrumbs/BopmaticBreadcrumbs';
import PageHeader from '../components/pageHeader/pageHeader';
import { useParams } from 'react-router-dom';
import { useEnvironment } from '../hooks/useEnvironment';
import Grid from '@mui/material/Grid2';
import DatabaseTablesTable from '../components/tables/DatabaseTablesTable';
import ServicesTable from '../components/tables/ServicesTable';
import LineChart from '../components/lineChart/LineChart';
import {
  getMetricsEndWindowForEnum,
  getMetricsSamplingPeriodForEnum,
  LINE_CHART_OPTIONS,
  TIME_TYPE,
} from '../components/lineChart/utils';
import { useMetrics } from '../hooks/useMetrics';

const DatabaseDetails: React.FC = () => {
  const { projectId, databaseName } = useParams();
  const environment = useEnvironment();
  const end = new Date();
  const [totalRequestsTime, setTotalRequestsTime] = React.useState<TIME_TYPE>(
    TIME_TYPE.LAST_24_HOURS
  );
  const [latencyTime, setLatencyTime] = React.useState<TIME_TYPE>(
    TIME_TYPE.LAST_24_HOURS
  );
  const [
    totalRequestsMetricsData,
    totalRequestsDataLoading,
    totalRequestsErrorText,
  ] = useMetrics(
    projectId,
    environment?.id,
    getMetricsEndWindowForEnum(totalRequestsTime),
    end,
    ['Reads', 'Writes'],
    'database_',
    ['database', 'table'], // TODO: Create enums with these values since they are consistent depending on page and resource type
    true,
    getMetricsSamplingPeriodForEnum(totalRequestsTime),
    'METRIC_SCOPE_DATABASE',
    databaseName
  );
  const [latencyMetricsData, latencyDataLoading, latencyErrorText] = useMetrics(
    projectId,
    environment?.id,
    getMetricsEndWindowForEnum(latencyTime),
    end,
    ['ReadDurationMS', 'WriteDurationMS'],
    'database_',
    ['database', 'table'], // TODO: Create enums with these values since they are consistent depending on page and resource type
    true,
    getMetricsSamplingPeriodForEnum(latencyTime),
    'METRIC_SCOPE_DATABASE',
    databaseName,
    '0.5'
  );
  return (
    <div>
      <BopmaticBreadcrumbs />
      <PageHeader title={`Database: ${databaseName}`} />
      <div>
        <Grid
          container
          spacing={2}
          columns={{ xs: 6, sm: 6, md: 6, lg: 12, xl: 12 }}
        >
          <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
            <div>
              <DatabaseTablesTable
                projId={projectId}
                envId={environment?.id}
                databaseName={databaseName}
              />
            </div>
          </Grid>
          <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
            <div>
              <ServicesTable
                projId={projectId}
                envId={environment?.id}
                isSimple={true}
                tableDescOverride="Services that access this database"
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
            chartName="Total requests"
            yAxisLabel="num. requests"
            data={totalRequestsMetricsData}
            options={LINE_CHART_OPTIONS}
            currTime={totalRequestsTime}
            setCurrTime={setTotalRequestsTime}
            isLoading={totalRequestsDataLoading}
            errorText={totalRequestsErrorText}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
          <LineChart
            chartName="Latency (p50)"
            yAxisLabel="milliseconds"
            data={latencyMetricsData}
            options={LINE_CHART_OPTIONS}
            currTime={latencyTime}
            setCurrTime={setLatencyTime}
            isLoading={latencyDataLoading}
            errorText={latencyErrorText}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default DatabaseDetails;
