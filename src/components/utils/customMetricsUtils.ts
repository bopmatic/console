import getBopmaticClient from '../../client/client';
import {
  ListMetricsEntry,
  MetricsScope,
  ProjectDescription,
} from '../../client';
import { GridColDef } from '@mui/x-data-grid';
import {
  ChartData,
  Dataset,
  getColorForDataset,
  PromParsedFormat,
} from '../../hooks/utils';
import { Dayjs } from 'dayjs';
import {
  LINE_CHART_OPTIONS_DAILY,
  LINE_CHART_OPTIONS_HOURLY,
} from '../lineChart/utils';

export type MetricsNavigationTreeElement = {
  cardContent: string;
  projectName?: string;
  children?: MetricsNavigationTreeElement[];
  metricEntries?: ListMetricsEntryWrapper[];
};

export type ListMetricsEntryWrapper = ListMetricsEntry & {
  isSelected: boolean;
  projectId?: string;
  resourceName?: string;
};

export type MetricDataSet = {
  projectId: string;
  resourceName: string;
  metricName: string;
  dates: Date[];
  values: number[];
};

const SERVICE_NODE: MetricsNavigationTreeElement = {
  cardContent: 'Services',
};

const DATABASE_NODE: MetricsNavigationTreeElement = {
  cardContent: 'Databases',
};

const DATASTORE_NODE: MetricsNavigationTreeElement = {
  cardContent: 'Datastores',
};

export const ROOT_NODE: MetricsNavigationTreeElement = {
  cardContent: 'All available metrics',
  children: [SERVICE_NODE, DATABASE_NODE, DATASTORE_NODE],
};

export const fetchAllServicesTreeElements = async (
  projects: ProjectDescription[] | null,
  envId: string,
  metricEntries: ListMetricsEntryWrapper[]
) => {
  const serviceNameApiCalls = [];
  if (projects && projects.length && envId) {
    for (let i = 0; i < projects.length; i++) {
      serviceNameApiCalls.push(
        getBopmaticClient().listServices({
          header: {
            projId: projects[i].id,
            envId: envId,
          },
        })
      );
    }
    const allServiceNamesResponse = await Promise.all(serviceNameApiCalls);
    const serviceElements: MetricsNavigationTreeElement[] = [];
    for (const response of allServiceNamesResponse) {
      if (response.data.serviceNames && response.data.header?.projId) {
        const names = response.data.serviceNames;
        for (let i = 0; i < names.length; i++) {
          const treeEle: MetricsNavigationTreeElement = {
            cardContent: names[i],
            // TODO: Create helper function to get Project Name from Project ID given useProjects gives descriptions
            projectName: response.data.header.projId,
            metricEntries: metricEntries
              .filter((e) => e.scope === 'METRIC_SCOPE_SERVICE')
              .map((w) => {
                const newWrapper: ListMetricsEntryWrapper = {
                  ...w,
                  projectId: response.data.header?.projId,
                  resourceName: names[i],
                };
                return newWrapper;
              }),
          };
          serviceElements.push(treeEle);
        }
      }
    }
    // now go and add these serviceElements to tree
    return serviceElements;
  }
};

export const fetchAllDatabaseTreeElements = async (
  projects: ProjectDescription[] | null,
  envId: string,
  metricEntries: ListMetricsEntryWrapper[]
) => {
  const databaseNameApiCalls = [];
  if (projects && projects.length && envId) {
    for (let i = 0; i < projects.length; i++) {
      databaseNameApiCalls.push(
        getBopmaticClient().listDatabases({
          header: {
            projId: projects[i].id,
            envId: envId,
          },
        })
      );
    }
    const allDatabaseNamesResponse = await Promise.all(databaseNameApiCalls);
    const databaseElements: MetricsNavigationTreeElement[] = [];
    for (const response of allDatabaseNamesResponse) {
      if (response.data.databaseNames && response.data.header?.projId) {
        const names = response.data.databaseNames;
        for (let i = 0; i < names.length; i++) {
          const treeEle: MetricsNavigationTreeElement = {
            cardContent: names[i],
            // TODO: Create helper function to get Project Name from Project ID given useProjects gives descriptions
            projectName: response.data.header.projId,
            metricEntries: metricEntries
              .filter((e) => e.scope === 'METRIC_SCOPE_DATABASE')
              .map((w) => {
                const newWrapper: ListMetricsEntryWrapper = {
                  ...w,
                  projectId: response.data.header?.projId,
                  resourceName: names[i],
                };
                return newWrapper;
              }),
          };
          databaseElements.push(treeEle);
        }
      }
    }
    // now go and add these serviceElements to tree
    return databaseElements;
  }
};

export const fetchAllDatastoreTreeElements = async (
  projects: ProjectDescription[] | null,
  envId: string,
  metricEntries: ListMetricsEntryWrapper[]
) => {
  const datastoreNamesApiCalls = [];
  if (projects && projects.length && envId) {
    for (let i = 0; i < projects.length; i++) {
      datastoreNamesApiCalls.push(
        getBopmaticClient().listDatastores({
          header: {
            projId: projects[i].id,
            envId: envId,
          },
        })
      );
    }
    const allDatastoreNamesResponse = await Promise.all(datastoreNamesApiCalls);
    const datastoreElements: MetricsNavigationTreeElement[] = [];
    for (const response of allDatastoreNamesResponse) {
      if (response.data.datastoreNames && response.data.header?.projId) {
        const names = response.data.datastoreNames;
        for (let i = 0; i < names.length; i++) {
          const treeEle: MetricsNavigationTreeElement = {
            cardContent: names[i],
            // TODO: Create helper function to get Project Name from Project ID given useProjects gives descriptions
            projectName: response.data.header.projId,
            metricEntries: metricEntries
              .filter((e) => e.scope === 'METRIC_SCOPE_DATASTORE')
              .map((w) => {
                const newWrapper: ListMetricsEntryWrapper = {
                  ...w,
                  projectId: response.data.header?.projId,
                  resourceName: names[i],
                };
                return newWrapper;
              }),
          };
          datastoreElements.push(treeEle);
        }
      }
    }
    // now go and add these serviceElements to tree
    return datastoreElements;
  }
};

let rows: ListMetricsEntry[];
export const MetricEntriesTableColumns: GridColDef<(typeof rows)[number]>[] = [
  {
    field: 'name',
    headerName: 'Metric name',
    flex: 1,
    headerClassName: 'bopmatic-table-column-header',
  },
  {
    field: 'description',
    headerName: 'Description',
    flex: 2,
    headerClassName: 'bopmatic-table-column-header',
  },
];

export const getSelectedMetrics = (
  tree: MetricsNavigationTreeElement[]
): ListMetricsEntryWrapper[] => {
  const selectedMetrics: ListMetricsEntryWrapper[] = [];

  const traverse = (node: MetricsNavigationTreeElement): void => {
    // Filter and collect selected metric entries
    if (node.metricEntries) {
      selectedMetrics.push(
        ...node.metricEntries.filter((entry) => entry.isSelected)
      );
    }

    // Recursively traverse children
    node.children?.forEach((child) => traverse(child));
  };

  // Start traversal for each root element in the tree
  tree.forEach((root) => traverse(root));

  return selectedMetrics;
};

export const deselectMetricInTree = (
  tree: MetricsNavigationTreeElement[],
  metricName: string,
  resourceName: string,
  projectId: string
): void => {
  const traverse = (node: MetricsNavigationTreeElement): boolean => {
    // Check and update the metric entries
    if (node.metricEntries) {
      for (const entry of node.metricEntries) {
        if (
          entry.name === metricName &&
          entry.resourceName === resourceName &&
          entry.projectId === projectId
        ) {
          entry.isSelected = false; // Set isSelected to false
          return true; // Stop traversal as the metric is found
        }
      }
    }

    // Recursively traverse children if the metric isn't found
    if (node.children) {
      for (const child of node.children) {
        if (traverse(child)) {
          return true; // Stop traversal as the metric is found
        }
      }
    }

    return false; // Metric not found in this branch
  };

  // Start traversal for each root element in the tree
  tree.some((root) => traverse(root)); // Stop traversal once the metric is found
};

export const getResourceTypeForDisplay = (scope: MetricsScope | undefined) => {
  if (scope === 'METRIC_SCOPE_SERVICE') {
    return 'Service: ';
  } else if (scope === 'METRIC_SCOPE_DATABASE') {
    return 'Database: ';
  } else if (scope === 'METRIC_SCOPE_DATASTORE') {
    return 'Datastore: ';
  } else {
    return '';
  }
};

export const getRowId = (row: ListMetricsEntry) => {
  if (row.name) {
    return row.name;
  }
  return '0';
};

// sets matching names that are currently selected to true, all others to false
export const updateMetricsSelection = (
  treeElement: MetricsNavigationTreeElement,
  metricNames: string[]
): void => {
  treeElement.metricEntries?.forEach((entry) => {
    entry.isSelected = metricNames.includes(entry.name || '');
  });
};

export const generateMetricDataSet = (
  data: PromParsedFormat[],
  projectId: string,
  resourceName: string,
  metricName: string,
  scope: MetricsScope | undefined
): MetricDataSet => {
  // Find the metric with the specified name
  const metric = data.find((item) => item.name.split('_')[1] === metricName);

  if (!metric) {
    throw new Error(`Metric with name "${metricName}" not found.`);
  }

  // Filter metrics based on projectId and resourceName
  const filteredMetrics = metric.metrics.filter((entry) => {
    if (scope === 'METRIC_SCOPE_SERVICE') {
      return (
        entry.labels?.projectId === projectId &&
        entry.labels?.service === resourceName
      );
    } else if (scope === 'METRIC_SCOPE_DATABASE') {
      return (
        entry.labels?.projectId === projectId &&
        entry.labels?.database === resourceName
      );
    } else if (scope === 'METRIC_SCOPE_DATASTORE') {
      return (
        entry.labels?.projectId === projectId &&
        entry.labels?.datastore === resourceName
      );
    } else {
      return true;
    }
  });

  // Extract dates and values
  const dates: Date[] = filteredMetrics.map(
    (entry) => new Date(Number(entry.timestamp_ms))
  );
  const values: number[] = filteredMetrics.map((entry) => {
    if (entry.quantiles && entry.quantiles['1.0'] !== undefined) {
      // Use quantile "1.0" if present
      return entry.quantiles['1.0'];
    }
    // Default to the value property
    return Number(entry.value);
  });

  return {
    projectId,
    resourceName,
    metricName,
    dates,
    values,
  };
};

export const convertCustomMetricsToChartData = (
  metricDataSets: MetricDataSet[]
): ChartData => {
  // Collect all unique dates across all MetricDataSet objects
  const uniqueDates = Array.from(
    new Set(
      metricDataSets.flatMap((metricData) =>
        metricData.dates.map((date) => date.getTime())
      )
    )
  )
    .sort((a, b) => a - b) // Sort dates in ascending order
    .map((timestamp) => new Date(timestamp)); // Convert back to Date objects

  // Generate datasets for each MetricDataSet
  const datasets: Dataset[] = metricDataSets.map((metricData) => {
    // Create a map of date to value for quick lookup
    const dateToValueMap = new Map<number, number>(
      metricData.dates.map((date, index) => [
        date.getTime(),
        metricData.values[index],
      ])
    );

    // Populate data array aligned with uniqueDates
    const data = uniqueDates.map(
      (date) => dateToValueMap.get(date.getTime()) ?? null
    );
    const datasetName = `${metricData.projectId}-${metricData.resourceName}-${metricData.metricName}`;
    const color = getColorForDataset(datasetName);

    return {
      data,
      label: datasetName,
      borderColor: color,
      backgroundColor: color,
      spanGaps: true,
    };
  });

  return {
    labels: uniqueDates,
    datasets,
  };
};

export const calculateSamplingPeriod = (
  startTime: Dayjs,
  endTime: Dayjs
): number => {
  // Calculate the difference in hours between startTime and endTime
  const durationInHours = endTime.diff(startTime, 'hour');

  // Determine the sampling period based on the duration
  if (durationInHours <= 24) {
    return 300; // 5 minutes
  } else if (durationInHours <= 48) {
    return 900; // 15 minutes
  } else if (durationInHours <= 92) {
    return 1800; // 30 minutes
  } else {
    return 3600; // 60 minutes
  }
};

export const getLineChartOptions = (
  startTime: Dayjs | null,
  endTime: Dayjs | null
) => {
  if (startTime && endTime) {
    // Calculate the difference in hours between startTime and endTime
    const durationInHours = endTime.diff(startTime, 'hour');

    // Determine the sampling period based on the duration
    if (durationInHours <= 48) {
      return LINE_CHART_OPTIONS_HOURLY;
    } else {
      return LINE_CHART_OPTIONS_DAILY;
    }
  } else {
    return LINE_CHART_OPTIONS_HOURLY;
  }
};

export const populateHourlyDataCustomMetrics = (
  startDate: Dayjs,
  endDate: Dayjs,
  chartData: ChartData
): ChartData => {
  // Round endDate to the next hour if it's not already at the top of an hour
  const roundedEndDate = endDate.clone();
  if (
    roundedEndDate.minute() > 0 ||
    roundedEndDate.second() > 0 ||
    roundedEndDate.millisecond() > 0
  ) {
    roundedEndDate.add(1, 'hour').startOf('hour'); // Add 1 hour and reset to the top of the hour
  }

  // Generate hourly timestamps between start and rounded end dates
  const hourlyTimestamps: Dayjs[] = [];
  for (
    let date = roundedEndDate.clone();
    date.isAfter(startDate);
    date = date.subtract(1, 'hour')
  ) {
    hourlyTimestamps.push(date.clone());
  }

  // Merge existing labels with hourly timestamps and remove duplicates, then sort
  const combinedLabels = [
    ...chartData.labels.map((label) => label.getTime()),
    ...hourlyTimestamps.map((timestamp) => timestamp.valueOf()),
  ];
  const sortedLabels = Array.from(new Set(combinedLabels)) // Remove duplicates by timestamp
    .sort((a, b) => a - b) // Sort by time
    .map((timestamp) => new Date(timestamp)); // Convert back to Date objects for Chart.js compatibility

  // Populate each dataset's data array with `null` placeholders for new timestamps
  chartData.datasets.forEach((dataset) => {
    const combinedData: (number | null)[] = [];

    // Create a map of original labels (Date objects) to their corresponding data values
    const labelToDataMap = new Map(
      chartData.labels.map((label, index) => [
        label.getTime(),
        dataset.data[index],
      ])
    );

    // Populate combinedData based on sortedLabels
    sortedLabels.forEach((label) => {
      combinedData.push(labelToDataMap.get(label.getTime()) ?? null);
    });

    // Update dataset's data with the aligned combinedData
    dataset.data = combinedData;
  });

  // Update the labels in the chartData object
  chartData.labels = sortedLabels;
  return chartData;
};
