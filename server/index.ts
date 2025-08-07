import { createServer } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  try {
    // Create a Vite development server
    const server = await createServer({
      configFile: path.resolve(__dirname, '../vite.config.ts'),
      root: path.resolve(__dirname, '../client'),
      server: {
        host: '0.0.0.0',
        port: 5000,
        allowedHosts: ['1825e33d-34de-4a68-91bb-3463bec44651-00-2i6gcv7069y1z.riker.replit.dev', 'localhost', '127.0.0.1']
      }
    });

    await server.listen();
    console.log('PrintLite development server running on http://0.0.0.0:5000');
  } catch (error) {
    console.error('Failed to start Vite server:', error);
    process.exit(1);
  }
}

startServer();