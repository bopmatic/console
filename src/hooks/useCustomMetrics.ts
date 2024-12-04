import { useEffect, useState } from 'react';
import { ChartData } from 'chart.js';
import {
  calculateSamplingPeriod,
  convertCustomMetricsToChartData,
  generateMetricDataSet,
  ListMetricsEntryWrapper,
  MetricDataSet,
  populateHourlyDataCustomMetrics,
} from '../components/utils/customMetricsUtils';
import parsePrometheusTextFormat from '../prometheusParserLocal';
import getBopmaticClient from '../client/client';
import { Dayjs } from 'dayjs';

export const useCustomMetrics = (
  startTime: Dayjs | null,
  endTime: Dayjs | null,
  allSelectedMetrics: ListMetricsEntryWrapper[],
  envId: string
): [ChartData<'line'> | undefined, boolean, string | undefined] => {
  // this hook should do all of the formatting
  // NOTE: We aren't using app state here because each metrics call and set will be unique
  const [metrics, setMetrics] = useState<ChartData<'line'>>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>();
  useEffect(() => {
    const apiCalls = [];
    const requestMetadata: {
      metric: (typeof allSelectedMetrics)[0];
      requestIndex: number;
    }[] = [];
    if (
      allSelectedMetrics &&
      allSelectedMetrics.length &&
      startTime &&
      endTime
    ) {
      const _startTime = startTime.unix() * 1000;
      const _endTime = endTime.unix() * 1000;
      for (let i = 0; i < allSelectedMetrics.length; i++) {
        const m = allSelectedMetrics[i];
        apiCalls.push(
          getBopmaticClient().getMetricSamples({
            projId: m.projectId,
            envId: envId,
            startTime: _startTime.toString(),
            endTime: _endTime.toString(),
            format: 'METRIC_FORMAT_OPENMETRICS',
            scope: m.scope,
            scopeQualifier: m.resourceName,
            metricNames: [m.name as string],
            samplePeriod: calculateSamplingPeriod(
              startTime,
              endTime
            ).toString(),
          })
        );
        // Store metadata about the request
        requestMetadata.push({ metric: m, requestIndex: i });
      }
      setIsLoading(true);
      Promise.all(apiCalls)
        .then((allResponse) => {
          // for (const getMetricsReply of allResponse) {
          const allMetricDataSets: MetricDataSet[] = [];
          allResponse.forEach((getMetricsReply, index) => {
            const associatedMetric = requestMetadata[index].metric;
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
                  'Too many datapoints. Use a custom timeframe on the metrics page.'
                );
              }
              throw new Error('Something went wrong calling the API.');
            }
            if (getMetricsReply?.data?.metricBuf) {
              // TODO: Remove the "#Average" from the end of lines if they exist
              const parsed0 = getMetricsReply?.data?.metricBuf.replace(
                / #Minimum/g,
                ''
              );
              const parsed1 = parsed0.replace(/ #Maximum/g, '');
              const parsed2 = parsed1.replace(/ #Average/g, '');
              const parsed = parsePrometheusTextFormat(parsed2, 'api');
              // NOW: for each metric set, create a custom map that will hold all the metrics
              // then, at the end we can format the final version from this map with a helper function
              // this will ensure we don't miss any timestamps in the x-axis for disparate data sets
              const metricDataSet = generateMetricDataSet(
                parsed,
                associatedMetric.projectId as string,
                associatedMetric.resourceName as string,
                associatedMetric.name as string,
                associatedMetric.scope
              );
              allMetricDataSets.push(metricDataSet);
            } else {
              // there is no metric data returned from API for this metric and this timeframe
              // we want to create a dataset of just nulls
              const emptyDataset: MetricDataSet = {
                dates: [],
                values: [],
                metricName: `${associatedMetric.name as string} (no data)`,
                projectId: associatedMetric.projectId as string,
                resourceName: associatedMetric.resourceName as string,
              };
              allMetricDataSets.push(emptyDataset);
            }
          });
          // convert to chart data
          let charJsData = convertCustomMetricsToChartData(allMetricDataSets);
          charJsData = populateHourlyDataCustomMetrics(
            startTime,
            endTime,
            charJsData
          );
          setMetrics(charJsData);
        })
        .catch((error) => {
          if (error instanceof Error) {
            const errorMessage: string = error.message;
            setErrorText(errorMessage);
          } else {
            // Handle the case where the error is not an instance of Error
            console.error('An unexpected error occurred:', error);
            setErrorText('An unexpected error occurred');
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [allSelectedMetrics, startTime, endTime]);

  return [metrics, isLoading, errorText];
};
