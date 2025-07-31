#!/usr/bin/env node

// Simple wrapper to start the server without tsx dependency issues
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Starting PrintLite server...');

// Try different methods to run the TypeScript server
const methods = [
  // Method 1: Try npx tsx
  () => spawn('npx', ['tsx', 'server/index.ts'], { 
    stdio: 'inherit', 
    env: { ...process.env, NODE_ENV: 'development' }
  }),
  
  // Method 2: Try node with tsx/esm loader
  () => spawn('node', ['--loader', 'tsx/esm', 'server/index.ts'], { 
    stdio: 'inherit', 
    env: { ...process.env, NODE_ENV: 'development' }
  }),
  
  // Method 3: Try direct tsx from node_modules
  () => spawn('node', [join(__dirname, 'node_modules/tsx/dist/cli.cjs'), 'server/index.ts'], { 
    stdio: 'inherit', 
    env: { ...process.env, NODE_ENV: 'development' }
  }),
];

async function tryMethod(methodIndex = 0) {
  if (methodIndex >= methods.length) {
    console.error('All methods failed to start the server');
    process.exit(1);
  }
  
  console.log(`Trying method ${methodIndex + 1}...`);
  
  const child = methods[methodIndex]();
  
  child.on('error', (error) => {
    console.error(`Method ${methodIndex + 1} failed:`, error.message);
    tryMethod(methodIndex + 1);
  });
  
  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(`Method ${methodIndex + 1} exited with code ${code}`);
      tryMethod(methodIndex + 1);
    }
  });
}

tryMethod();