// Frontend-only development server for PrintLite
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting PrintLite frontend-only development server...');

// Start Vite development server for the client
const clientPath = path.resolve(__dirname, '../client');
const viteProcess = spawn('npx', ['vite', 'dev', '--host', '0.0.0.0', '--port', '5000'], {
  cwd: clientPath,
  stdio: 'inherit',
  shell: true
});

viteProcess.on('error', (error) => {
  console.error('❌ Failed to start Vite development server:', error);
  process.exit(1);
});

viteProcess.on('close', (code) => {
  console.log(`Vite development server exited with code ${code}`);
  process.exit(code);
});

// Handle process termination gracefully
process.on('SIGTERM', () => {
  console.log('🛑 Terminating development server...');
  viteProcess.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('🛑 Terminating development server...');
  viteProcess.kill('SIGINT');
});

console.log('✅ PrintLite is now running as a frontend-only application!');