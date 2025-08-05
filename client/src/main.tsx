import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Amplify } from 'aws-amplify'
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient()

// Configure Amplify asynchronously
async function initializeApp() {
  try {
    // Try to import the amplify_outputs.json file
    const amplifyModule = await import('../../amplify_outputs.json');
    const amplifyConfig = amplifyModule.default || amplifyModule;
    
    // Check if this is a placeholder config or real config
    if (amplifyConfig.auth?.user_pool_id?.includes('placeholder')) {
      console.log('Detected placeholder Amplify config, running in development mode');
      // Use environment variables if available, otherwise fallback to local backend
      const isDevelopment = import.meta.env.DEV || !import.meta.env.VITE_AMPLIFY_ENABLED;
      if (isDevelopment) {
        console.log('Using local backend for development');
        // Minimal config that won't cause errors
        Amplify.configure({
          Auth: { Cognito: { userPoolId: 'local', userPoolClientId: 'local' } },
          Storage: { S3: { region: 'us-east-1', bucket: 'local' } }
        });
      } else {
        Amplify.configure(amplifyConfig);
      }
    } else {
      console.log('Configuring Amplify with production configuration');
      Amplify.configure(amplifyConfig);
    }
  } catch (error) {
    console.log('No Amplify configuration found, running in local development mode');
    // Minimal config that won't cause undefined errors
    Amplify.configure({
      Auth: { Cognito: { userPoolId: 'local', userPoolClientId: 'local' } },
      Storage: { S3: { region: 'us-east-1', bucket: 'local' } }
    });
  }

  createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}

initializeApp();
