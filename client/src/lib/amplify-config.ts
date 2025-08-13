import { Amplify } from 'aws-amplify';

// Simple Amplify configuration for Storage only
const amplifyConfig = {
  Storage: {
    S3: {
      bucket: 'printlite-storage-bucket', 
      region: import.meta.env.VITE_AWS_REGION || 'ap-south-1'
    }
  }
};

// Configure Amplify with minimal config
Amplify.configure(amplifyConfig);

console.log('AWS Amplify Storage configured for bucket: printlite-storage-bucket');

export { amplifyConfig };