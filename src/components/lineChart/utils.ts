import { _DeepPartialObject } from 'chart.js/dist/types/utils';
import {
  CoreChartOptions,
  DatasetChartOptions,
  ElementChartOptions,
  LineControllerChartOptions,
  PluginChartOptions,
  ScaleChartOptions,
} from 'chart.js';

export enum TIME_TYPE {
  LAST_24_HOURS = 'LAST_24_HOURS',
  LAST_48_HOURS = 'LAST_48_HOURS',
  LAST_7_DAYS = 'LAST_7_DAYS',
  LAST_30_DAYS = 'LAST_30_DAYS',
}

const LINE_CHART_OPTIONS_HOURLY: _DeepPartialObject<
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
        unit: 'hour',
        minUnit: 'hour',
        displayFormats: {
          day: 'MMM d', // Example: 'Nov 1' for days
          hour: 'HH:mm',
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
        maxTicksLimit: 10,
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

const LINE_CHART_OPTIONS_DAILY: _DeepPartialObject<
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
        minUnit: 'day',
        displayFormats: {
          day: 'MMM d', // Example: 'Nov 1' for days
          hour: 'HH:mm',
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
        maxTicksLimit: 7,
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

export const getTimeTypeFromElementText = (text: string): TIME_TYPE => {
  switch (text.toLowerCase()) {
    case 'last 24 hours':
      return TIME_TYPE.LAST_24_HOURS;
    case 'last 48 hours':
      return TIME_TYPE.LAST_48_HOURS;
    case 'last 7 days':
      return TIME_TYPE.LAST_7_DAYS;
    case 'last 30 days':
      return TIME_TYPE.LAST_30_DAYS;
    default:
      return TIME_TYPE.LAST_24_HOURS;
  }
};

export const getTimeTextFromEnum = (type: TIME_TYPE): string => {
  switch (type) {
    case TIME_TYPE.LAST_24_HOURS:
      return 'Last 24 hours';
    case TIME_TYPE.LAST_48_HOURS:
      return 'Last 48 hours';
    case TIME_TYPE.LAST_7_DAYS:
      return 'Last 7 days';
    case TIME_TYPE.LAST_30_DAYS:
      return 'Last 30 days';
    default:
      return 'Last 24 hours';
  }
};

// These must be static or we create a cyclical reference to a date that constantly changes by seconds
const end = new Date(); // today right now
const LAST_24_DATE = new Date(end.getTime() - 24 * 60 * 60 * 1000);
const LAST_48_DATE = new Date(end.getTime() - 48 * 60 * 60 * 1000);
const LAST_168_DATE = new Date(end.getTime() - 168 * 60 * 60 * 1000);
const LAST_720_DATE = new Date(end.getTime() - 720 * 60 * 60 * 1000);

export const getMetricsEndWindowForEnum = (type: TIME_TYPE): Date => {
  switch (type) {
    case TIME_TYPE.LAST_24_HOURS:
      return LAST_24_DATE;
    case TIME_TYPE.LAST_48_HOURS:
      return LAST_48_DATE;
    case TIME_TYPE.LAST_7_DAYS:
      return LAST_168_DATE;
    case TIME_TYPE.LAST_30_DAYS:
      return LAST_720_DATE;
    default:
      return LAST_24_DATE;
  }
};

export const getMetricsSamplingPeriodForEnum = (type: TIME_TYPE): number => {
  switch (type) {
    case TIME_TYPE.LAST_24_HOURS:
      return 300;
    case TIME_TYPE.LAST_48_HOURS:
      return 300;
    case TIME_TYPE.LAST_7_DAYS:
      return 3600;
    case TIME_TYPE.LAST_30_DAYS:
      return 3600;
    default:
      return 300;
  }
};

export const getChartJsOptionsForEnum = (type: TIME_TYPE) => {
  switch (type) {
    case TIME_TYPE.LAST_24_HOURS:
      return LINE_CHART_OPTIONS_HOURLY;
    case TIME_TYPE.LAST_48_HOURS:
      return LINE_CHART_OPTIONS_HOURLY;
    case TIME_TYPE.LAST_7_DAYS:
      return LINE_CHART_OPTIONS_DAILY;
    case TIME_TYPE.LAST_30_DAYS:
      return LINE_CHART_OPTIONS_DAILY;
    default:
      return LINE_CHART_OPTIONS_HOURLY;
  }
};
