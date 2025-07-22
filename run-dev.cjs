#!/usr/bin/env node
// Development server runner for PrintLite migration
// This ensures the application runs properly in Replit environment

const { spawn } = require('child_process');

// Set environment to development
process.env.NODE_ENV = 'development';

console.log('🚀 Starting PrintLite Development Server');
console.log('📍 Environment: Development');
console.log('🌐 Port: 5000');

// Run the working CommonJS server
const child = spawn('node', ['server/simple-server.cjs'], {
  stdio: 'inherit',
  env: process.env
});

child.on('close', (code) => {
  console.log(`Server exited with code ${code}`);
  process.exit(code);
});

child.on('error', (error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});