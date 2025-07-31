import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Amplify } from 'aws-amplify'
import outputs from '../../amplify_outputs.json'
import App from './App.tsx'
import './index.css'

// Configure Amplify
console.log('Configuring Amplify with configuration')
Amplify.configure(outputs)

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
