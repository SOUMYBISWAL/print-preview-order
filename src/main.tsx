import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'
import { Amplify } from 'aws-amplify';
import amplifyOutputs from '../amplify_outputs.json';

const queryClient = new QueryClient()

console.log('PrintLite - Frontend-only version loaded');

Amplify.configure(amplifyOutputs);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
