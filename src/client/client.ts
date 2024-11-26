import { Configuration } from './configuration';
import { BASE_PATH } from './base';
import { ServiceRunnerApi } from './api';
import { SignUpApi } from './signupapi';

let token = '';

export const updateBopmaticClientToken = (newToken: string) => {
  token = newToken;
  // Reinitialize configuration with the new token
  configuration.apiKey = `Bearer ${token}`;
  client = new ServiceRunnerApi(configuration);
};

const configuration = new Configuration({
  basePath: BASE_PATH,
  apiKey: `Bearer ${token}`,
});

let client = new ServiceRunnerApi(configuration);

export const getBopmaticClient = () => {
  return client;
};

const signupClient = new SignUpApi();

export const getSignupClient = () => {
  return signupClient;
};

export default getBopmaticClient;
