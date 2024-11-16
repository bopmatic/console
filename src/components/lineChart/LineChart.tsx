import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ChartData,
  CoreChartOptions,
  ElementChartOptions,
  PluginChartOptions,
  DatasetChartOptions,
  ScaleChartOptions,
  LineControllerChartOptions,
  TimeSeriesScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import React, { Dispatch, SetStateAction } from 'react';
import { _DeepPartialObject } from 'chart.js/dist/types/utils';
import LineChartTimeDropdown from './LineChartTimeDropdown';
import { TIME_TYPE } from './utils';
import CircularProgress from '@mui/material/CircularProgress';

// Register required components, including the TimeScale
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  TimeSeriesScale
);

type LineChartProps = {
  data: ChartData<'line'> | undefined;
  options:
    | _DeepPartialObject<
        CoreChartOptions<'line'> &
          ElementChartOptions<'line'> &
          PluginChartOptions<'line'> &
          DatasetChartOptions<'line'> &
          ScaleChartOptions<'line'> &
          LineControllerChartOptions
      >
    | undefined;
  chartName: string;
  yAxisLabel: string;
  currTime: TIME_TYPE;
  setCurrTime: Dispatch<SetStateAction<TIME_TYPE>>;
  isLoading: boolean;
  errorText: string | undefined;
};

const LineChart: React.FC<LineChartProps> = ({
  data,
  options,
  chartName,
  yAxisLabel,
  currTime,
  setCurrTime,
  isLoading,
  errorText,
}) => {
  return (
    <div className="bg-white border-bopgreyborder border p-4 min-h-80 rounded">
      <div className="flex justify-between">
        <h3>{chartName}</h3>
        <LineChartTimeDropdown currTime={currTime} setCurrTime={setCurrTime} />
      </div>
      {isLoading ? (
        <div className="flex w-full justify-center mt-20">
          <CircularProgress color="primary" />
        </div>
      ) : errorText ? (
        <div className="flex w-full justify-center mt-20 p-10">
          <span className="text-boperror font-bold">
            Error loading data: {errorText}
          </span>
        </div>
      ) : data && data?.labels?.length ? (
        <>
          <div className="pt-4 pb-2 text-bopgreytext text-xs">{yAxisLabel}</div>
          <Line data={data} options={options} />
        </>
      ) : (
        <div className="flex w-full justify-center mt-12 p-10">
          <div>
            <div className="text-bopgreytext font-bold text-center">
              There is no data for this time range.
            </div>
            <div className="text-center pl-10 pr-10 text-sm text-bopgreytext">
              Try changing the time frame in the dropdown above or use the
              custom metrics view.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LineChart;
