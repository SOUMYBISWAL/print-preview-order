import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Amplify } from 'aws-amplify'
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient()

// Configure Amplify asynchronously
async function initializeApp() {
  try {
    // Dynamic import for build compatibility
    const amplifyModule = await import('../../amplify_outputs.json');
    const amplifyConfig = amplifyModule.default || amplifyModule;
    console.log('Configuring Amplify with configuration');
    Amplify.configure(amplifyConfig);
  } catch (error) {
    console.log('Running without Amplify configuration (development mode)');
    // Use comprehensive mock config for development that won't cause undefined errors
    Amplify.configure({
      Auth: {
        Cognito: {
          region: 'us-east-1',
          userPoolId: 'us-east-1_mock',
          userPoolClientId: 'mock_client_id',
          identityPoolId: 'us-east-1:mock-identity-pool',
          loginWith: {
            email: true
          },
          signUpVerificationMethod: 'code',
          userAttributes: {
            email: {
              required: true
            }
          }
        }
      },
      Storage: {
        S3: {
          region: 'us-east-1',
          bucket: 'mock-storage-bucket'
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
