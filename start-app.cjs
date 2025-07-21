#!/usr/bin/env node

const { spawn } = require('child_process');

console.log('Starting PrintLite application...');

const child = spawn('node', ['server/simple-server.cjs'], {
  stdio: 'inherit',
  cwd: process.cwd(),
  env: { ...process.env, NODE_ENV: 'development' }
});

child.on('exit', (code) => {
  console.log(`Application exited with code ${code}`);
  process.exit(code);
});

child.on('error', (err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});