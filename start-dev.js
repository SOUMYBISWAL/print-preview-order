#!/usr/bin/env node

// Development startup script that bypasses tsx dependency issues
// Uses the compiled JavaScript files that already work

console.log('🚀 Starting PrintLite Development Server...');

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set environment for development
process.env.NODE_ENV = 'development';

console.log('📦 Using JavaScript server files to bypass tsx issues...');

// Start the server using the working index.js
const serverPath = join(__dirname, 'server', 'index.js');
const server = spawn('node', [serverPath], {
  stdio: 'inherit',
  env: process.env,
  cwd: __dirname
});

server.on('error', (error) => {
  console.error('❌ Server failed to start:', error.message);
  process.exit(1);
});

server.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ Server exited with code ${code}`);
  } else {
    console.log('✅ Server shut down gracefully');
  }
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Terminating server...');
  server.kill('SIGTERM');
});

console.log('✅ Development server startup script ready');