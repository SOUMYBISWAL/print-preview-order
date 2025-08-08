#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Run tsx directly from node_modules
const tsxPath = join(__dirname, 'node_modules', 'tsx', 'dist', 'cli.mjs');
const serverPath = join(__dirname, 'server', 'index.ts');

const tsx = spawn('node', [tsxPath, serverPath], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development' }
});

tsx.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

tsx.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});