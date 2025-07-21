#!/usr/bin/env node

// Simple server runner that uses npx to run tsx
const { spawn } = require('child_process');

console.log('Starting server with tsx...');

const child = spawn('npx', ['--yes', 'tsx', 'server/index.ts'], {
  stdio: 'inherit',
  cwd: process.cwd(),
  env: { ...process.env, NODE_ENV: 'development' }
});

child.on('exit', (code) => {
  console.log(`Server exited with code ${code}`);
  process.exit(code);
});

child.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});