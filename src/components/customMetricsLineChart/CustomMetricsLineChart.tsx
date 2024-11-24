import * as React from 'react';
import { Line } from 'react-chartjs-2';
import {
  getLineChartOptions,
  ListMetricsEntryWrapper,
} from '../utils/customMetricsUtils';
import { useState } from 'react';
import { useCustomMetrics } from '../../hooks/useCustomMetrics';
import CircularProgress from '@mui/material/CircularProgress';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Button from '@mui/material/Button';
import dayjs, { Dayjs } from 'dayjs';

type CustomMetricsLineChartProps = {
  allSelectedMetrics: ListMetricsEntryWrapper[];
  envId: string;
};

const CustomMetricsLineChart: React.FC<CustomMetricsLineChartProps> = ({
  allSelectedMetrics,
  envId,
}) => {
  const [startTime, setStartTime] = useState<Dayjs | null>(
    dayjs().subtract(24, 'hour')
  );
  // NOTE: This is the one we use for the useMetrics hook because we only want to trigger change when use clicks "update timeframe" button
  const [start, setStart] = useState<Dayjs | null>(
    dayjs().subtract(24, 'hour')
  );
  const [endTime, setEndTime] = useState<Dayjs | null>(dayjs());
  // NOTE: This is the one we use for the useMetrics hook because we only want to trigger change when use clicks "update timeframe" button
  const [end, setEnd] = useState<Dayjs | null>(dayjs());
  const handleStartTimeChange = (newDate: Dayjs | null) => {
    setStartTime(newDate);
  };

  const handleEndTimeChange = (newDate: Dayjs | null) => {
    setEndTime(newDate);
  };
  const emptyMetrics = {
    labels: [],
    datasets: [],
  };
  const [metricsData, isLoading, errorText] = useCustomMetrics(
    start,
    end,
    allSelectedMetrics,
    envId
  );
  const handleUpdateTimeframe = () => {
    // user wants to update start or end time for the chart
    setStart(startTime);
    setEnd(endTime);
  };
  return (
    <div className="bg-white border-bopgreyborder border p-4 rounded max-w-4xl">
      <div className="flex">
        <div className="ml-2">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Start time (UTC)"
              value={startTime}
              onChange={handleStartTimeChange}
            />
          </LocalizationProvider>
        </div>
        <div className="ml-2">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="End time (UTC)"
              value={endTime}
              onChange={handleEndTimeChange}
            />
          </LocalizationProvider>
        </div>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          onClick={handleUpdateTimeframe}
          sx={{ ml: 1, fontWeight: 'bold', maxHeight: 55 }}
        >
          Update timeframe
        </Button>
      </div>
      <div className="relative mt-4">
        <Line
          data={
            metricsData && allSelectedMetrics.length
              ? metricsData
              : emptyMetrics
          }
          options={getLineChartOptions(start, end)}
        />
        {isLoading && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.9)', // Optional background
            }}
          >
            <CircularProgress />
          </div>
        )}
        {errorText && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.9)', // Optional background
            }}
          >
            <div className="text-boperror font-bold">Error: {errorText}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomMetricsLineChart;
