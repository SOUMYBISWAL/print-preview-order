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
    // Use minimal mock config for development
    Amplify.configure({
      Auth: { region: 'us-east-1' },
      API: { region: 'us-east-1' },
      Storage: { region: 'us-east-1' }
    });
  }

  createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}

initializeApp();
