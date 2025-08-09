import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Change to client directory and run vite directly
const clientPath = path.join(__dirname, '..', 'client');
process.chdir(clientPath);

console.log('🚀 Starting Vite development server...');
console.log('📁 Working directory:', clientPath);

// Start Vite development server  
const vite = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '5000'], {
  stdio: 'inherit',
  shell: true,
  cwd: clientPath
});

vite.on('close', (code) => {
  console.log(`Vite process exited with code ${code}`);
  process.exit(code);
});

vite.on('error', (err) => {
  console.error('Failed to start Vite:', err);
  process.exit(1);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down...');
  vite.kill();
  process.exit();
});