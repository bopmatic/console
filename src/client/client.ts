import axios, { AxiosRequestConfig, AxiosError, AxiosInstance } from 'axios';
import { Configuration } from './configuration';
import { BASE_PATH } from './base';
import { ServiceRunnerApi } from './api';
import { SignUpApi } from './signupapi';

let token = '';

export const updateBopmaticClientToken = (newToken: string) => {
  token = newToken;
  // Reinitialize configuration with the new token
  configuration.apiKey = `Bearer ${token}`;
  client = createServiceRunnerApiInstance(configuration);
};

const configuration = new Configuration({
  basePath: BASE_PATH,
  apiKey: `Bearer ${token}`,
});

// Initialize Axios instance
const axiosInstance: AxiosInstance = axios.create();

// Configure retry logic for Axios
axiosInstance.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error: AxiosError) => {
    const config = error.config as AxiosRequestConfig & { retryCount?: number };

    // Retry logic for HTTP 429
    // NOTE: Also adding retry for 401 (Auth) because our DashboardLayout component refreshes the component but sometimes
    // if a user refreshed the page after 20+ minutes of inactivity the API requests fire before Cognito comes back
    // with the refresh token. In these cases, we can just retry after small delay. If the refreshToken is expired, the
    // dashboard layout component will redirect users to login page. This avoids an interceptor that refreshes the token
    // which could call AWS Cognito too many times for a page with many API calls.
    // TODO: Remove the 'OR ERR_NETWORK' section of this IF statement once we figure out the CORS exceptions that come back from API
    if (
      error.response?.status === 429 ||
      error.response?.status === 401 ||
      error.code === 'ERR_NETWORK'
    ) {
      const retryAfter =
        parseInt(error.response?.headers['retry-after'], 10) || 1; // Default retry after 1 second
      config.retryCount = (config.retryCount || 0) + 1;

      if (config.retryCount <= 5) {
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000)); // Wait before retrying
        return axiosInstance(config); // Retry the request
      }
    }

    return Promise.reject(error); // Reject if not retryable or exceeded retry limit
  }
);

// Create ServiceRunnerApi instance
let client = createServiceRunnerApiInstance(configuration);

function createServiceRunnerApiInstance(
  configuration: Configuration
): ServiceRunnerApi {
  return new ServiceRunnerApi(configuration, BASE_PATH, axiosInstance);
}

const signupClient = new SignUpApi();

export const getBopmaticClient = () => {
  return client;
};

export const getSignupClient = () => {
  return signupClient;
};

export default getBopmaticClient;
