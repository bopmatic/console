import { Configuration } from './configuration';
import { BASE_PATH } from './base';
import { ServiceRunnerApi } from './api';

const configuration = new Configuration({
  basePath: BASE_PATH,
});

const BopmaticClient = new ServiceRunnerApi(configuration);

export default BopmaticClient;
