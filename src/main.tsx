import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Amplify } from 'aws-amplify'
import App from './App.tsx'
import './index.css'

// Configure Amplify for backend integration
try {
  // Development configuration for Amplify
  const amplifyConfig = {
    Auth: {
      Cognito: {
        identityPoolId: import.meta.env.VITE_AWS_IDENTITY_POOL_ID || '',
        region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
        allowGuestAccess: true,
      }
    },
    Storage: {
      S3: {
        bucket: import.meta.env.VITE_AWS_S3_BUCKET || 'amplifyteamdrive',
        region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
      }
    }
  }
  Amplify.configure(amplifyConfig)
  console.log('Amplify configured successfully with development settings')
} catch (error) {
  console.warn('Amplify configuration failed:', error)
  console.log('Running in localStorage-only mode')
}

const queryClient = new QueryClient()

console.log('PrintLite - Amplify integrated version loaded');

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
