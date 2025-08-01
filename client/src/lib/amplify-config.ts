// AWS Amplify Configuration for PrintLite
import { Amplify } from 'aws-amplify';

// Import configuration - try new outputs format first, fallback to legacy
let amplifyConfig;
try {
  // Try new amplify_outputs.json format
  amplifyConfig = await import('../../../amplify_outputs.json');
  console.log('Loaded Amplify configuration from amplify_outputs.json');
} catch (error) {
  try {
    // Fallback to legacy amplifyconfiguration.json
    amplifyConfig = await import('../amplifyconfiguration.json');
    console.log('Loaded Amplify configuration from amplifyconfiguration.json');
  } catch (legacyError) {
    console.warn('No Amplify configuration found, using mock config for development');
    amplifyConfig = {
      version: "1",
      auth: {
        user_pool_id: "us-east-1_XXXXXXXXX",
        aws_region: "us-east-1",
        user_pool_client_id: "XXXXXXXXXXXXXXXXXX",
        identity_pool_id: "us-east-1:XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
      },
      storage: {
        aws_region: "us-east-1",
        bucket_name: "printlite-storage-bucket"
      }
    };
  }
}

// Configure Amplify
Amplify.configure(amplifyConfig);
console.log('Amplify configured successfully');

export { Amplify };
export default amplifyConfig;