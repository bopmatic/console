import { ApiHealth, apiHealthAtom, ApiHealthWrapper } from '../atoms';
import { useAtom } from 'jotai/index';
import { useEffect, useMemo, useState } from 'react';
import {
  calculateApiSuccessRates,
  evaluateHealthStatus,
  ServiceApiWrapper,
} from './utils';
import getBopmaticClient from '../client/client';
import parsePrometheusTextFormat from '../prometheusParserLocal';
import {
  METRICS_SAMPLING_PERIOD_IN_SECONDS,
  PREVIOUS_X_HOURS,
} from '../ApiHealthConstants';

export const useApiHealth = (
  envId: string | undefined,
  projectId: string | undefined,
  serviceApiWrappers: ServiceApiWrapper[]
): [ApiHealthWrapper[] | undefined, boolean] => {
  const [loading, setLoading] = useState(false);
  // raw output from app state
  const [apiHealth, setApiHealth] = useAtom(apiHealthAtom);
  // array of ApiHealthWrapper filtered on API name
  const apiHealthArrFiltered = useMemo(() => {
    return apiHealth?.filter((apiHealth) =>
      serviceApiWrappers.some(
        (serviceApi) =>
          serviceApi.serviceName === apiHealth.serviceName &&
          serviceApi.apiName === apiHealth.apiName
      )
    );
  }, [serviceApiWrappers, apiHealth]);

  // check if we have thisApiHealth; if undefined we don't have this health yet
  useEffect(() => {
    if (
      envId &&
      projectId &&
      serviceApiWrappers &&
      serviceApiWrappers.length &&
      (!apiHealthArrFiltered || !apiHealthArrFiltered.length)
    ) {
      const apiCalls = [];
      const requestMetadata: {
        serviceApiWrapper: (typeof serviceApiWrappers)[0];
        requestIndex: number;
      }[] = [];
      const startTime = new Date();
      startTime.setHours(startTime.getHours() - PREVIOUS_X_HOURS);
      const endTime = new Date();
      const _startTime = Math.floor(startTime.getTime() / 1000);
      const _endTime = Math.floor(endTime.getTime() / 1000);
      for (let i = 0; i < serviceApiWrappers.length; i++) {
        const s = serviceApiWrappers[i];
        apiCalls.push(
          getBopmaticClient().getMetricSamples({
            projId: projectId,
            envId: envId,
            startTime: _startTime.toString(),
            endTime: _endTime.toString(),
            format: 'METRIC_FORMAT_OPENMETRICS',
            scope: 'METRIC_SCOPE_SERVICE',
            scopeQualifier: s.serviceName,
            metricNames: ['Invocations', 'Errors'],
            samplePeriod: METRICS_SAMPLING_PERIOD_IN_SECONDS.toString(),
          })
        );
        // Store metadata about the request
        requestMetadata.push({ serviceApiWrapper: s, requestIndex: i });
      }
      setLoading(true);
      Promise.all(apiCalls)
        .then((allResponse) => {
          // Loop through each metrics response, parse out the data, then calculate success rate for each API
          const allWrappers: ApiHealthWrapper[] = [];
          allResponse.forEach((getMetricsReply, index) => {
            const associatedServiceApiWrapper =
              requestMetadata[index].serviceApiWrapper;
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
              const parsed0 = getMetricsReply?.data?.metricBuf.replace(
                / #Minimum/g,
                ''
              );
              const parsed1 = parsed0.replace(/ #Maximum/g, '');
              const parsed2 = parsed1.replace(/ #Average/g, '');
              const parsed = parsePrometheusTextFormat(parsed2, 'api');
              // NOTE: Code below helps test errors in metrics
              // const error = {
              //   value: '4',
              //   labels: {
              //     projectId: 'proj-1349909abe82993e',
              //     environmentId: 'env-0000000000000000',
              //     service: 'MyOrderService',
              //     api: 'GetOrder',
              //     period: '300s',
              //   },
              //   timestamp_ms: '1732735500000',
              // };
              // parsed[1].metrics.push(error);
              const apiSuccessRatesMap = calculateApiSuccessRates(parsed);
              Object.entries(apiSuccessRatesMap).forEach(
                ([api, successRate]) => {
                  const apiHealthWrapper: ApiHealthWrapper = {
                    envId,
                    projectId,
                    serviceName: associatedServiceApiWrapper.serviceName,
                    apiName: api,
                    health: evaluateHealthStatus(successRate),
                  };
                  allWrappers.push(apiHealthWrapper);
                }
              );
            } else {
              // there is no metric data returned from API for this metric and this timeframe
              // we want to create a "UNKNOWN" health node for this api
              const noDataApiHealthWrapper: ApiHealthWrapper = {
                envId,
                projectId,
                serviceName: associatedServiceApiWrapper.serviceName,
                apiName: associatedServiceApiWrapper.apiName,
                health: ApiHealth.UNKNOWN,
              };
              allWrappers.push(noDataApiHealthWrapper);
            }
          });
          // now set apiHealth
          setApiHealth(
            apiHealth ? [...apiHealth, ...allWrappers] : allWrappers
          );
        })
        .catch((error) => {
          console.log(
            'ERROR: Problem fetching metrics for API Health in useApiHealth hook:',
            error
          );
          throw error;
        })
        .finally(() => {
          setLoading(false);
        });
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [envId, projectId, serviceApiWrappers]);

  return [apiHealthArrFiltered, loading];
};
