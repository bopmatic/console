type ServiceMetricsLabel = {
  environmentId: string;
  period: string;
  projectId: string;
  service?: string;
  api?: string;
};

type DatabaseMetricsLabel = {
  environmentId: string;
  period: string;
  projectId: string;
  database?: string;
};

type PromMetrics = {
  labels?: ServiceMetricsLabel & DatabaseMetricsLabel;
  timestamp_ms?: string;
  value?: string;
  quantiles?: { [key: string]: number };
};

export type PromParsedFormat = {
  help: string;
  metrics: Array<PromMetrics>;
  name: string;
  type: string; // TODO: Make this enum
};

type ChartData = {
  labels: Date[];
  datasets: Dataset[];
};

type Dataset = {
  data: (number | null)[];
  label: string;
  borderColor: string;
  backgroundColor: string;
};

type DatasetMap = {
  [key: string]: Dataset;
};

type DatasetMapForTimestamp = {
  [key: string]: number | null;
};

// Used to maintain color map
const DATASET_COLOR_MAP: { [key: string]: string } = {};
let COLOR_INDEX = 0;
const COLOR_ARR = [
  '#FBA919', // Bopmatic orange
  '#228B22', // Forest Green
  '#4169E1', // Royal Blue
  '#B22222', // Firebrick
  '#4B0082', // Indigo
  '#DAA520', // Goldenrod
  '#2F4F4F', // Dark Slate Gray
  '#4682B4', // Steel Blue
  '#C71585', // Medium Violet Red
  '#8B0000', // Dark Red
  '#FF8C00', // Dark Orange
  '#008080', // Teal
  '#8B008B', // Dark Magenta
  '#DC143C', // Crimson
  '#191970', // Midnight Blue
  '#8B4513', // Saddle Brown
  '#556B2F', // Dark Olive Green
  '#483D8B', // Dark Slate Blue
  '#2E8B57', // Sea Green
  '#008B8B', // Dark Cyan
  '#800080', // Purple
];

const getNextColor = () => {
  return COLOR_ARR[COLOR_INDEX];
};

/**
 * Helper function that will provide a new color if the dataset name
 * does not yet have one assigned to it, or return the color if this
 * dataset already has one assigned to it.
 * @param datasetName
 */
const getColorForDataset = (datasetName: string): string => {
  if (DATASET_COLOR_MAP[datasetName]) {
    return DATASET_COLOR_MAP[datasetName];
  }
  // dataset doesn't yet have a color, let's go assign them one
  const color = getNextColor();
  COLOR_INDEX++;
  // store new color in colormap
  DATASET_COLOR_MAP[datasetName] = color;
  return DATASET_COLOR_MAP[datasetName];
};

// TODO: Optimize this where possible
// TODO: JAVADOCS + explain datasetLabelKeys
export const convertToChartData = (
  parsedTelemetryData: PromParsedFormat[],
  metricNames: string[],
  metricNamePrefix: string,
  datasetLabelKeys: string[],
  groupByMetricName: boolean,
  quantileVal?: string
) => {
  const chartData: ChartData = {
    labels: [], // X-axis labels (timestamps)
    datasets: [],
  };

  // A map to store datasets by name so we can group values by metric names
  const datasetNameSet: Set<string> = new Set();
  const timestampMap: Map<string, DatasetMapForTimestamp> = new Map<
    string,
    DatasetMapForTimestamp
  >();

  // step 1 - make a map where the key is timestamp and value is an object -> this object has key = dataset name and value = the value
  //              NOTE: Also create an array of the total set of unique dataset name (in the case of services its the APIs)
  parsedTelemetryData.forEach((metricGroup) => {
    const { name, metrics } = metricGroup;
    // name is "service_DurationMS" while metricNames = ["DurationMS"]; need to get rid of prefix safely
    if (name && metricNames.includes(name.split(metricNamePrefix)[1])) {
      metrics.forEach((metric) => {
        const { value, labels, timestamp_ms, quantiles } = metric;
        let _labelsKey: string | undefined = undefined;
        if (groupByMetricName) {
          _labelsKey = name.split(metricNamePrefix)[1];
        } else {
          // generate the key as an amalg. of each key string provided in the array separated by "-"
          // this is particularly helpful for example ["database", "table"] to show a line for each table in each database
          for (let i = 0; i < datasetLabelKeys.length; i++) {
            const dsLK = datasetLabelKeys[i] as keyof typeof labels; // TODO: Enforce this through an enum possibly
            if (labels) {
              _labelsKey = _labelsKey
                ? `${_labelsKey}-${labels[dsLK]}`
                : labels[dsLK];
            }
          }
        }
        console.log('_labelsKey:', _labelsKey);
        if (quantiles) {
          // this metric has quantiles
          if (!quantileVal) {
            throw new Error(
              `The requested metric '${name}' has quantiles in the data but no quantile value was specified to generate ChartJS datasets from.`
            );
          }
          if (!timestamp_ms) {
            throw new Error(
              'Missing timestamp_ms in metric. Verify data returned from API and parsing mechanism.'
            );
          }
          if (!timestampMap.has(timestamp_ms)) {
            // new timestamp, add to map
            const _d: DatasetMapForTimestamp = {};
            // TODO: Make this (.api) an input somehow
            // _d[labels?.api as string] = quantiles[quantileVal];
            _d[_labelsKey as string] = quantiles[quantileVal];
            timestampMap.set(timestamp_ms, _d);
          } else {
            // existing timestamp, just add dataset values
            const curr = timestampMap.get(timestamp_ms);
            // if (curr) curr[labels?.api as string] = quantiles[quantileVal];
            if (curr) curr[_labelsKey as string] = quantiles[quantileVal];
          }
          // datasetNameSet.add(labels?.api as string);
          datasetNameSet.add(_labelsKey as string);
        } else {
          if (!timestamp_ms || !value || !labels) {
            // something went wrong with parser before this
            throw new Error(
              'Missing timestamp_ms, value, labels, or quantiles in metric. Verify data returned from API and parsing mechanism.'
            );
          }
          if (!timestampMap.has(timestamp_ms)) {
            // new timestamp, add to map
            const _d: DatasetMapForTimestamp = {};
            // TODO: Make this (.api) an input somehow
            _d[_labelsKey as string] = parseFloat(value);
            timestampMap.set(timestamp_ms, _d);
          } else {
            // existing timestamp, just add dataset values
            const curr = timestampMap.get(timestamp_ms);
            if (curr) curr[_labelsKey as string] = parseFloat(value);
          }
          datasetNameSet.add(_labelsKey as string);
        }
      });
    } else {
      console.log('metric name is not included in the array of metric names');
    }
  });

  console.log('timestampMap:', timestampMap);

  // step 2 - go through each timestamp value (object key) and determine if there is a prop for each dataset name in the dataset unique array
  //              - if one is missing, populate with NULL
  timestampMap.forEach((curr) => {
    // check that there is a value for each datasetName entry and if not, enter as null
    if (curr) {
      datasetNameSet.forEach((datasetName) => {
        if (!curr[datasetName]) {
          // there is no value for this dataset on this timestamp; add as null
          curr[datasetName] = null;
        }
      });
    }
  });

  // sort and set the labels array
  const _labels: Array<Date> = [];
  timestampMap.forEach((datasetMapForTimestamp, timestampStr) => {
    const t = new Date(parseInt(timestampStr));
    _labels.push(t);
  });
  _labels.sort((a, b) => a.getTime() - b.getTime());
  const sortedDatasetNamesArr: string[] = Array.from(datasetNameSet).sort();

  // step 4 - loop through each label (timestamp), then loop through each dataset name and generate the data arrays for each dataset
  const datasetsMap: DatasetMap = {};
  // generate the final set of DATASETS from the sorted array of timestamps
  for (let i = 0; i < sortedDatasetNamesArr.length; i++) {
    const datasetName = sortedDatasetNamesArr[i];
    if (!datasetsMap[datasetName]) {
      // dataset doesn't exist yet, create it
      const color = getColorForDataset(datasetName);
      datasetsMap[datasetName] = {
        data: [],
        label: datasetName,
        borderColor: color,
        backgroundColor: color,
      };
    }
    // now add the values by looping through sorted timestamps
    for (let i = 0; i < _labels.length; i++) {
      const _timestamp = _labels[i];
      const datasetMapForTimestamp = timestampMap.get(
        _timestamp.getTime().toString()
      );
      if (datasetMapForTimestamp) {
        const val = datasetMapForTimestamp[datasetName];
        datasetsMap[datasetName].data.push(val);
      } else {
        throw new Error(
          'Error parsing data for Chart.js: datasetMapForTimestamp is null'
        );
      }
    }
  }

  // finally set the return object
  chartData.labels = _labels;
  chartData.datasets = Object.values(datasetsMap);
  return chartData;
};

export type MetricObject = {
  name: string;
  help: string;
  type: string;
  metrics: {
    value: string;
    labels: {
      projectId: string;
      environmentId: string;
      datastore: string;
      period: string;
    };
    timestamp_ms: string;
  }[];
};

export const formatDatastoreDataInMegaBytes = (
  metricDataArray: MetricObject[]
): MetricObject[] => {
  // Loop through each MetricObject in the array
  metricDataArray.forEach((metricData) => {
    // Convert each metric's value from bytes to MB
    metricData.metrics.forEach((metric) => {
      const valueInBytes = parseFloat(metric.value);
      const valueInMB = valueInBytes / (1024 * 1024); // Convert bytes to MB
      metric.value = valueInMB.toFixed(2); // Format to 2 decimal places for readability
    });
  });

  return metricDataArray;
};
