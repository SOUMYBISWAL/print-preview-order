import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Amplify } from 'aws-amplify'
import App from './App.tsx'
import './index.css'

// Amplify Gen2 configuration will be auto-generated once backend is deployed
// For now, configure basic structure to work with Amplify Gen2
const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_placeholder',
      userPoolClientId: 'placeholder',
      identityPoolId: 'us-east-1:placeholder-identity-pool',
      region: 'us-east-1',
      allowGuestAccess: true,
    }
  },
  Storage: {
    S3: {
      bucket: 'amplifyteamdrive-dev',
      region: 'us-east-1',
    }
  }
}

Amplify.configure(amplifyConfig)
console.log('PrintLite - Amplify Gen2 ready for deployment')

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
