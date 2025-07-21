import { Amplify } from 'aws-amplify';

// Initialize configuration variables
let amplifyConfig: any = null;
let hasAWSCredentials = false;

// Check for Gen 2 configuration first
const checkForGen2Config = async () => {
  try {
    // Check if amplify_outputs.json exists
    const response = await fetch('/amplify_outputs.json');
    if (response.ok) {
      amplifyConfig = await response.json();
      hasAWSCredentials = true;
      console.log('Using AWS Amplify Gen 2 configuration');
      return true;
    }
  } catch (e) {
    // File doesn't exist, continue to fallback
  }
  return false;
};

// Fallback to environment variables for Gen 1 or manual configuration
const setupFallbackConfig = () => {
  const hasEnvCredentials = import.meta.env.VITE_AWS_REGION && 
                           import.meta.env.VITE_AWS_S3_BUCKET &&
                           import.meta.env.VITE_AWS_COGNITO_IDENTITY_POOL_ID;
  
  if (hasEnvCredentials) {
    amplifyConfig = {
      aws_project_region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
      aws_cognito_identity_pool_id: import.meta.env.VITE_AWS_COGNITO_IDENTITY_POOL_ID,
      aws_cognito_region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
      aws_user_pools_id: import.meta.env.VITE_AWS_COGNITO_USER_POOL_ID,
      aws_user_pools_web_client_id: import.meta.env.VITE_AWS_COGNITO_USER_POOL_CLIENT_ID,
      oauth: {},
      aws_cognito_username_attributes: ['EMAIL'],
      aws_cognito_social_providers: [],
      aws_cognito_signup_attributes: ['EMAIL'],
      aws_cognito_mfa_configuration: 'OFF',
      aws_cognito_mfa_types: ['SMS'],
      aws_cognito_password_protection_settings: {
        passwordPolicyMinLength: 8,
        passwordPolicyCharacters: []
      },
      aws_cognito_verification_mechanisms: ['EMAIL'],
      aws_user_files_s3_bucket: import.meta.env.VITE_AWS_S3_BUCKET,
      aws_user_files_s3_bucket_region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
      Storage: {
        AWSS3: {
          bucket: import.meta.env.VITE_AWS_S3_BUCKET,
          region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
        }
      },
      aws_appsync_graphqlEndpoint: `https://${import.meta.env.VITE_AWS_APPSYNC_API_ID}.appsync.${import.meta.env.VITE_AWS_REGION || 'us-east-1'}.amazonaws.com/graphql`,
      aws_appsync_region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
      aws_appsync_authenticationType: 'AWS_IAM',
      aws_appsync_apiKey: import.meta.env.VITE_AWS_APPSYNC_API_KEY
    };
    hasAWSCredentials = true;
  } else {
    console.log('AWS credentials not found. Running in local mode without file upload to S3.');
  }
};

// Initialize Amplify
const initializeAmplify = async () => {
  const hasGen2 = await checkForGen2Config();
  if (!hasGen2) {
    setupFallbackConfig();
  }
  
  if (amplifyConfig && hasAWSCredentials) {
    Amplify.configure(amplifyConfig);
  }
};

// Initialize immediately
initializeAmplify();

export default Amplify;
export { hasAWSCredentials };