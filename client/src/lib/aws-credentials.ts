// AWS Credentials provider for Amplify
export const getAWSCredentials = () => {
  return {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '',
    region: import.meta.env.VITE_AWS_REGION || 'ap-south-1',
  };
};

// Check if credentials are available
export const areCredentialsAvailable = () => {
  const creds = getAWSCredentials();
  return !!(creds.accessKeyId && creds.secretAccessKey);
};