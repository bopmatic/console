import { useEffect, useState } from 'react';
import { getBopmaticClient } from '../client/client';
import { GetMetricSamplesRequest, MetricsScope } from '../client';
import parsePrometheusTextFormat from '../prometheusParserLocal';
import {
  convertToChartData,
  formatDatastoreDataInMegaBytes,
  populateHourlyData,
} from './utils';
import { ChartData } from 'chart.js';

export const useMetrics = (
  projectId: string | undefined,
  envId: string | undefined,
  startTime: Date,
  endTime: Date,
  metricNames: string[],
  metricNamePrefix: string,
  datasetLabelKeys: string[],
  groupByMetricName: boolean,
  samplingPeriod: number,
  scope?: MetricsScope,
  scopeQualifier?: string,
  quantileVal?: string
): [ChartData<'line'> | undefined, boolean, string | undefined] => {
  // this hook should do all of the formatting
  // NOTE: We aren't using app state here because each metrics call and set will be unique
  const [metrics, setMetrics] = useState<ChartData<'line'>>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastStartTime, setLastStartTime] = useState<Date>();
  const [errorText, setErrorText] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const _startTime = Math.floor(startTime.getTime());
        const _endTime = Math.floor(endTime.getTime());
        const req: GetMetricSamplesRequest = {
          projId: projectId,
          envId: envId,
          startTime: _startTime.toString(),
          endTime: _endTime.toString(),
          format: 'METRIC_FORMAT_OPENMETRICS',
          samplePeriod: samplingPeriod.toString(),
        };
        // conditionally add parameters to request if provided
        if (scope) {
          req.scope = scope;
        }
        if (scopeQualifier) {
          req.scopeQualifier = scopeQualifier;
        }
        if (metricNames && metricNames.length) {
          req.metricNames = metricNames;
        }
        const getMetricsReply = await getBopmaticClient().getMetricSamples(req);
        // check for errors
        // TODO: Make this generic and easier to do with client, maybe bake this into client
        const possibleError = JSON.parse(getMetricsReply.request.response);
        if (possibleError.result.status !== 'STATUS_OK') {
          // found error from API response
          if (
            possibleError.result.statusDetail.includes(
              'You may reduce the datapoints requested'
            )
          ) {
            throw new Error(
              'Too many datapoints. Try selecting a smaller time frame.'
            );
          }
          throw new Error('Something went wrong calling the API.');
        }
        if (getMetricsReply?.data?.metricBuf) {
          const parsed0 = getMetricsReply?.data?.metricBuf.replace(
            / #Minimum/g,
            ''
          );
          const parsed1 = parsed0.replace(/ #Maximum/g, '');
          const parsed2 = parsed1.replace(/ #Average/g, '');
          let parsed = parsePrometheusTextFormat(parsed2, 'api');
          if (
            metricNames[0] === 'Capacity' &&
            datasetLabelKeys[0] === 'datastore'
          ) {
            // This is the Datastore capacity metric -- format the data from bytes to MB
            parsed = formatDatastoreDataInMegaBytes(parsed);
          }
          let chartData = convertToChartData(
            parsed,
            metricNames,
            metricNamePrefix,
            datasetLabelKeys,
            groupByMetricName,
            quantileVal
          );
          // populate null data points to force ChartJs to respect the start and end time so data is relative to the window
          chartData = populateHourlyData(startTime, endTime, chartData);
          setErrorText(undefined); // make sure to empty out any errors that may have existed before
          setMetrics(chartData);
        }
      } catch (error) {
        if (error instanceof Error) {
          const errorMessage: string = error.message;
          setErrorText(errorMessage);
        } else {
          // Handle the case where the error is not an instance of Error
          console.error('An unexpected error occurred:', error);
          setErrorText('An unexpected error occurred');
        }
      }
      setIsLoading(false);
      setLastStartTime(startTime);
    };

    if (
      (!metrics || startTime.getTime() !== lastStartTime?.getTime()) &&
      projectId &&
      envId &&
      !isLoading
    ) {
      setIsLoading(true);
      fetchData();
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [metrics, projectId, envId, startTime]); // manually selecting which items we want to watch for here

  return [metrics, isLoading, errorText];
};
