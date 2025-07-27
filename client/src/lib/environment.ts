// Environment detection and configuration for PrintLite

export const isAmplifyEnvironment = () => {
  return !!(
    import.meta.env.VITE_USER_POOL_ID ||
    import.meta.env.VITE_GRAPHQL_ENDPOINT ||
    window.location.hostname.includes('.amplifyapp.com')
  );
};

export const isDevelopment = () => {
  return import.meta.env.DEV || import.meta.env.NODE_ENV === 'development';
};

export const getApiBaseUrl = () => {
  if (isAmplifyEnvironment()) {
    return import.meta.env.VITE_API_URL || '/api';
  }
  
  if (isDevelopment()) {
    return 'http://localhost:5000/api';
  }
  
  return '/api';
};

export const config = {
  apiBaseUrl: getApiBaseUrl(),
  isAmplify: isAmplifyEnvironment(),
  isDev: isDevelopment(),
  
  // AWS Amplify configuration
  amplify: {
    userPoolId: import.meta.env.VITE_USER_POOL_ID,
    userPoolClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
    identityPoolId: import.meta.env.VITE_IDENTITY_POOL_ID,
    graphqlEndpoint: import.meta.env.VITE_GRAPHQL_ENDPOINT,
    apiKey: import.meta.env.VITE_API_KEY,
    s3Bucket: import.meta.env.VITE_S3_BUCKET,
    region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  },
  
  // Feature flags
  features: {
    enableCloudStorage: isAmplifyEnvironment(),
    enableAuthenticatedUploads: isAmplifyEnvironment(),
    enableRealTimeUpdates: isAmplifyEnvironment(),
  }
};

export default config;