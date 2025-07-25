#!/usr/bin/env node

// Wrapper script to start the server using the working CommonJS server
// This bypasses the tsx dependency issue
const { spawn } = require('child_process');

console.log('Starting PrintLite server...');

const serverProcess = spawn('node', ['start-server.cjs'], {
  stdio: 'inherit',
  env: { 
    ...process.env, 
    NODE_ENV: process.env.NODE_ENV || 'development' 
  }
});

serverProcess.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

serverProcess.on('error', (err) => {
  console.error('Failed to start server:', err);
});