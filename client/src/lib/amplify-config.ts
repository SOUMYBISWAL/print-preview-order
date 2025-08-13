import { Amplify } from 'aws-amplify';

// Manual Amplify configuration for Storage
const amplifyConfig = {
  Storage: {
    S3: {
      bucket: 'printlite-storage-bucket',
      region: 'ap-south-1',
    }
  }
};

// Configure Amplify with the storage configuration
Amplify.configure(amplifyConfig);

console.log('AWS Amplify Storage configured for bucket: printlite-storage-bucket');

export { amplifyConfig };