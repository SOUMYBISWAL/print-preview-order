import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Import Amplify configuration
import './lib/amplify-config'

createRoot(document.getElementById("root")!).render(<App />);
