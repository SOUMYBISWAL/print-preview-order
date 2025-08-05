import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Amplify } from 'aws-amplify'
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient()

// Configure Amplify asynchronously
async function initializeApp() {
  try {
    // Use environment variables for configuration if available
    const apiUrl = import.meta.env.VITE_API_URL;
    const region = import.meta.env.VITE_AWS_REGION || 'us-east-1';
    const userPoolId = import.meta.env.VITE_USER_POOL_ID;
    const userPoolClientId = import.meta.env.VITE_USER_POOL_CLIENT_ID;
    const storageBucket = import.meta.env.VITE_STORAGE_BUCKET;
    
    // If environment variables are provided, use them
    if (userPoolId && userPoolClientId) {
      console.log('Using environment variable configuration');
      Amplify.configure({
        Auth: {
          Cognito: {
            userPoolId,
            userPoolClientId,
            region,
            loginWith: { email: true }
          }
        },
        Storage: storageBucket ? {
          S3: { region, bucket: storageBucket }
        } : undefined,
        API: apiUrl ? {
          GraphQL: { endpoint: apiUrl, region, defaultAuthMode: 'userPool' }
        } : undefined
      });
      return;
    }
    
    // Fallback: No environment variables, use local development mode
    console.log('No AWS configuration provided, running in local development mode');
    console.log('To use AWS Amplify, set environment variables in AWS Console');
    
    // Use minimal config for local development
    Amplify.configure({
      Auth: { 
        Cognito: { 
          userPoolId: 'local-dev', 
          userPoolClientId: 'local-dev',
          region: 'us-east-1'
        } 
      },
      Storage: { 
        S3: { 
          region: 'us-east-1', 
          bucket: 'local-dev' 
        } 
      }
    });
  } catch (error) {
    console.log('Error configuring Amplify, using local development mode');
    // Minimal config that won't cause undefined errors
    Amplify.configure({
      Auth: { 
        Cognito: { 
          userPoolId: 'local-dev', 
          userPoolClientId: 'local-dev',
          region: 'us-east-1'
        } 
      },
      Storage: { 
        S3: { 
          region: 'us-east-1', 
          bucket: 'local-dev' 
        } 
      }
    });
  }

  createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}

initializeApp();
