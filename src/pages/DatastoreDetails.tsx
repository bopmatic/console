import React, { useEffect, useState } from 'react';
import BopmaticBreadcrumbs from '../components/breadcrumbs/BopmaticBreadcrumbs';
import PageHeader from '../components/pageHeader/pageHeader';
import Grid from '@mui/material/Grid2';
import ServicesTable from '../components/tables/ServicesTable';
import { useParams } from 'react-router-dom';
import { useEnvironment } from '../hooks/useEnvironment';
import { useDatastores } from '../hooks/useDatastores';
import PropertiesContainer, {
  KeyValuePair,
} from '../components/propertiesContainer/PropertiesContainer';
import {
  getMetricsEndWindowForEnum,
  getMetricsSamplingPeriodForEnum,
  LINE_CHART_OPTIONS,
  TIME_TYPE,
} from '../components/lineChart/utils';
import { useMetrics } from '../hooks/useMetrics';
import LineChart from '../components/lineChart/LineChart';
import { formatBytes } from '../components/utils/byteUtils';
import { _DeepPartialObject } from 'chart.js/dist/types/utils';
import {
  CoreChartOptions,
  DatasetChartOptions,
  ElementChartOptions,
  LineControllerChartOptions,
  PluginChartOptions,
  ScaleChartOptions,
} from 'chart.js';

const DatastoreDetails: React.FC = () => {
  const { projectId, datastoreName } = useParams();
  const environment = useEnvironment();
  const datastores = useDatastores(projectId, environment?.id);
  const datastoresDescriptionFiltered = datastores?.filter(
    (d) => d.datastoreHeader?.datastoreName === datastoreName
  );
  const datastoreDescription = datastoresDescriptionFiltered?.length
    ? datastoresDescriptionFiltered[0]
    : undefined;
  const end = new Date();
  const [datastoreProperties, setDatastoreProperties] = useState<
    KeyValuePair[]
  >([]);
  const [capacityTime, setCapacityTime] = React.useState<TIME_TYPE>(
    TIME_TYPE.LAST_30_DAYS
  );
  const [numObjectsTime, setNumObjectsTime] = React.useState<TIME_TYPE>(
    TIME_TYPE.LAST_30_DAYS
  );
  const [capacityMetricsData, capacityDataLoading, capacityErrorText] =
    useMetrics(
      projectId,
      environment?.id,
      getMetricsEndWindowForEnum(capacityTime),
      end,
      ['Capacity'],
      'datastore_',
      ['datastore'], // TODO: Create enums with these values since they are consistent depending on page and resource type
      true,
      getMetricsSamplingPeriodForEnum(capacityTime),
      'METRIC_SCOPE_DATASTORE',
      datastoreName
    );
  const [numObjectsMetricsData, numObjectsDataLoading, numObjectsErrorText] =
    useMetrics(
      projectId,
      environment?.id,
      getMetricsEndWindowForEnum(numObjectsTime),
      end,
      ['NumObjects'],
      'datastore_',
      ['datastore'], // TODO: Create enums with these values since they are consistent depending on page and resource type
      true,
      getMetricsSamplingPeriodForEnum(numObjectsTime),
      'METRIC_SCOPE_DATASTORE',
      datastoreName
    );

  useEffect(() => {
    if (datastoreDescription) {
      const props: KeyValuePair[] = [
        {
          key: 'Total objects',
          value: datastoreDescription.numObjects ?? '0',
        },
        {
          key: 'Capacity consumed',
          value: datastoreDescription.capacityConsumedInBytes
            ? formatBytes(
                parseInt(datastoreDescription.capacityConsumedInBytes)
              )
            : '0 Bytes',
        },
      ];
      setDatastoreProperties(props);
    }
  }, [datastoreDescription]);

  // TODO: Centralize this if we need to share this version with other charts
  const options: _DeepPartialObject<
    CoreChartOptions<'line'> &
      ElementChartOptions<'line'> &
      PluginChartOptions<'line'> &
      DatasetChartOptions<'line'> &
      ScaleChartOptions<'line'> &
      LineControllerChartOptions
  > = {
    scales: {
      x: {
        type: 'timeseries',
        time: {
          unit: 'day',
          displayFormats: {
            day: 'MMM d', // Example: 'Nov 1' for days
            hour: 'MMM d, h a', // Use lowercase 'a' for AM/PM in date-fns format
          },
        },
        grid: {
          display: false, // Disable vertical grid lines
        },
        ticks: {
          source: 'auto', // Allow Chart.js to generate ticks automatically
          autoSkip: true, // Optional: Skip some labels if there are too many
          maxRotation: 0, // Keep labels horizontal
          minRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          maxTicksLimit: 5, // Limit the number of horizontal lines to 5
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom', // Move the legend to the bottom
        align: 'start', // Align the legend to the left
        labels: {
          padding: 20, // Optional: Add padding between the labels and chart
        },
      },
    },
  };

  return (
    <div>
      <BopmaticBreadcrumbs />
      <PageHeader title={`Datastore: ${datastoreName}`} />
      <div>
        <Grid
          container
          spacing={2}
          columns={{ xs: 6, sm: 6, md: 6, lg: 12, xl: 12 }}
        >
          <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
            <div className="pb-6">
              <PropertiesContainer
                keyValuePairs={datastoreProperties}
                useHalfWidth={true}
              />
            </div>
          </Grid>
          <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
            <div>
              <ServicesTable
                projId={projectId}
                envId={environment?.id}
                isSimple={true}
                tableDescOverride="Services that access this datastore"
              />
            </div>
          </Grid>
        </Grid>
      </div>
      <h2 className="pt-6">Metrics</h2>
      <div className="pb-4 text-bopgreytext text-sm">
        Note: these metrics are daily snapshots
      </div>
      <Grid
        container
        spacing={2}
        columns={{ xs: 6, sm: 6, md: 6, lg: 12, xl: 12 }}
      >
        <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
          <LineChart
            chartName="Capacity"
            yAxisLabel="MB"
            data={capacityMetricsData}
            options={options}
            currTime={capacityTime}
            setCurrTime={setCapacityTime}
            isLoading={capacityDataLoading}
            errorText={capacityErrorText}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
          <LineChart
            chartName="Total Objects"
            yAxisLabel="num. objects"
            data={numObjectsMetricsData}
            options={options}
            currTime={numObjectsTime}
            setCurrTime={setNumObjectsTime}
            isLoading={numObjectsDataLoading}
            errorText={numObjectsErrorText}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default DatastoreDetails;
