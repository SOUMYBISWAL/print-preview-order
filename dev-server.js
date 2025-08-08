#!/usr/bin/env node

// Simple development server for frontend-only PrintLite
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting PrintLite frontend development server...');

// Change to client directory and run Vite
const viteProcess = spawn('npx', ['vite', 'dev', '--host', '0.0.0.0', '--port', '5000'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit',
  shell: true
});

viteProcess.on('error', (error) => {
  console.error('❌ Failed to start development server:', error);
  process.exit(1);
});

viteProcess.on('close', (code) => {
  console.log(`Development server exited with code ${code}`);
  process.exit(code);
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('🛑 Terminating development server...');
  viteProcess.kill();
});

process.on('SIGINT', () => {
  console.log('🛑 Terminating development server...');
  viteProcess.kill();
});