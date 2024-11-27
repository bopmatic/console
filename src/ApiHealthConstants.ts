/**
 * This constant changes the timeframe we use to pull metrics and calculate API health.
 * Currently, 1 means we are only pulling metrics from the past hour. If you want the last
 * day, change this to 24.
 */
export const PREVIOUS_X_HOURS = 1;

/**
 * Sampling period for GetMetricsSample API call. This should only change if you decide
 * to make the PREVIOUS_X_HOURS greater than 24 or 48. In that case, recommend using
 * 1800 or 3600.
 */
export const METRICS_SAMPLING_PERIOD_IN_SECONDS = 300;

/**
 * This value represents what we calculate as "HEALTHY". Currently, if success rate is
 * higher than "95%" we return "HEALTHY". This is the number inclusive, meaning >= X
 */
export const HEALTHY_GREATER_THAN_THRESHOLD = 95;

/**
 * This value represents what we calculate as "DEGRADED", where the success rate of the API
 * falls between this number (inclusive) and the value of HEALTHY_GREATER_THAN_THRESHOLD (exclusive)
 */
export const DEGRADED_GREATER_THAN_THRESHOLD = 90;
// NOTE: Any percentage below the DEGRADED_GREATER_THAN_THRESHOLD will be "UNHEALTHY
