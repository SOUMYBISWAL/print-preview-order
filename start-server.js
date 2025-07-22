#!/usr/bin/env node
const { spawn } = require('child_process');

// Set environment variable
process.env.NODE_ENV = 'development';

// Run tsx with npx
const child = spawn('npx', ['tsx', 'server/index.ts'], {
  stdio: 'inherit',
  env: process.env
});

child.on('close', (code) => {
  process.exit(code);
});