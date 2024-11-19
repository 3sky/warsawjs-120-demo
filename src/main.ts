import { App } from 'aws-cdk-lib';
import { SSMStack } from './SSMStack';


// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.AWS_ACCOUNT,
  region: process.env.AWS_REGION
};

const app = new App();

new SSMStack(app, 'warsawjs-120-demo-dev', { env: devEnv });

app.synth();
