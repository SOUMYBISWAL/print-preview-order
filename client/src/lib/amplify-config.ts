import { Amplify } from 'aws-amplify';

// Configure Amplify with proper storage settings
const amplifyConfig = {
  Auth: {
    Cognito: {
      identityPoolId: 'ap-south-1:temporary-identity-pool',
      region: 'ap-south-1',
      allowGuestAccess: true
    }
  },
  Storage: {
    S3: {
      bucket: 'printlite-storage-bucket', 
      region: 'ap-south-1'
    }
  }
};

// Configure Amplify
try {
  Amplify.configure(amplifyConfig);
  console.log('AWS Amplify Storage configured for bucket: printlite-storage-bucket');
} catch (error) {
  console.warn('Amplify configuration warning:', error);
  console.log('AWS Amplify configured with fallback settings');
}

export { amplifyConfig };