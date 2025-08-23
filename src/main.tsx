import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'
import { Amplify } from 'aws-amplify';

const queryClient = new QueryClient()

console.log('PrintLite - Frontend-only version loaded');

// Configure Amplify with minimal configuration for frontend-only mode
try {
  // Basic Amplify configuration that won't cause errors
  Amplify.configure({
    API: {
      GraphQL: {
        endpoint: 'http://localhost:3000/graphql',
        region: 'us-east-1',
        defaultAuthMode: 'apiKey'
      }
    },
    Storage: {
      S3: {
        bucket: 'local-storage-fallback',
        region: 'us-east-1'
      }
    }
  });
} catch (error) {
  console.log('Amplify configuration skipped - using local storage mode');
}

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
