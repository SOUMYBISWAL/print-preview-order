#!/usr/bin/env node
import { build } from 'vite';

async function buildFrontend() {
  try {
    console.log('Building frontend for Amplify deployment...');
    
    await build({
      configFile: './vite.config.ts',
      mode: 'production',
    });
    
    console.log('✅ Frontend build completed successfully');
  } catch (error) {
    console.error('❌ Frontend build failed:', error);
    process.exit(1);
  }
}

buildFrontend();