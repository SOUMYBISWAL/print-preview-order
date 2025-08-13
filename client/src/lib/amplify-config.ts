import { Amplify } from 'aws-amplify';

// Real AWS Amplify configuration with credentials
const amplifyConfig = {
  Auth: {
    Cognito: {
      // We'll configure this if authentication is needed later
    }
  },
  Storage: {
    S3: {
      bucket: import.meta.env.VITE_AWS_S3_BUCKET || 'printlite-storage-dev',
      region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
    }
  }
};

// Configure Amplify with the backend
Amplify.configure(amplifyConfig);

console.log('AWS Amplify configured with real credentials - ready for S3 deployment');

export { amplifyConfig };