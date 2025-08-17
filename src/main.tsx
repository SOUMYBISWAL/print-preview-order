import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Amplify } from 'aws-amplify'
import App from './App.tsx'
import './index.css'

// Configure Amplify - will use proper config once backend is deployed
const amplifyConfig = {
  Auth: {
    Cognito: {
      identityPoolId: 'ap-south-1:temporary-identity-pool',
      region: 'ap-south-1',
      allowGuestAccess: true
    }
  }
}

try {
  Amplify.configure(amplifyConfig)
  console.log('Amplify configured for development')
} catch (error) {
  console.log('Amplify config loading, will update after backend deployment')
}

const queryClient = new QueryClient()

console.log('PrintLite - Amplify backend integrated version loaded');

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
