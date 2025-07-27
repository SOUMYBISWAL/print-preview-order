// AWS Amplify Gen 2 Configuration for PrintLite
import { Amplify } from 'aws-amplify';

// Configuration for Amplify Gen 2
// This will be populated with actual values during deployment
const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.VITE_USER_POOL_ID || '',
      userPoolClientId: process.env.VITE_USER_POOL_CLIENT_ID || '',
      identityPoolId: process.env.VITE_IDENTITY_POOL_ID || '',
      loginWith: {
        email: true,
      },
      signUpAttributes: ['email'],
      userAttributes: {
        email: { required: true, mutable: true },
        name: { required: false, mutable: true },
      },
    }
  },
  API: {
    GraphQL: {
      endpoint: process.env.VITE_GRAPHQL_ENDPOINT || '',
      region: process.env.VITE_AWS_REGION || 'us-east-1',
      defaultAuthMode: 'userPool' as const,
      apiKey: process.env.VITE_API_KEY || '',
    }
  },
  Storage: {
    S3: {
      bucket: process.env.VITE_S3_BUCKET || '',
      region: process.env.VITE_AWS_REGION || 'us-east-1',
    }
  }
};

// Only configure Amplify if we have the required environment variables
if (amplifyConfig.Auth.Cognito.userPoolId && amplifyConfig.API.GraphQL.endpoint) {
  Amplify.configure(amplifyConfig);
  console.log('Amplify Gen 2 configured successfully');
} else {
  console.log('Amplify environment variables not found, using local backend');
}

export { Amplify };
export default amplifyConfig;