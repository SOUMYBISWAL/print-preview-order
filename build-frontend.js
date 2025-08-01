#!/usr/bin/env node

// Build script for AWS Amplify deployment
// Handles the frontend build process with proper configuration

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting PrintLite frontend build for AWS Amplify...');

// Ensure amplify_outputs.json exists
const amplifyOutputsPath = './amplify_outputs.json';
if (!fs.existsSync(amplifyOutputsPath)) {
  console.log('📝 Creating mock amplify_outputs.json for build...');
  const mockConfig = {
    version: "1",
    auth: {
      user_pool_id: "us-east-1_XXXXXXXXX",
      aws_region: "us-east-1",
      user_pool_client_id: "XXXXXXXXXXXXXXXXXX",
      identity_pool_id: "us-east-1:XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
    },
    data: {
      url: "https://XXXXXXXXXXXXXXXXXXXX.appsync-api.us-east-1.amazonaws.com/graphql",
      aws_region: "us-east-1",
      default_authorization_type: "API_KEY",
      api_key: "da2-XXXXXXXXXXXXXXXXXXXX"
    },
    storage: {
      aws_region: "us-east-1",
      bucket_name: "amplify-XXXXXXXXXX-XXXXX-XXXXXX-storage-XXXXXXX"
    }
  };
  fs.writeFileSync(amplifyOutputsPath, JSON.stringify(mockConfig, null, 2));
}

try {
  console.log('📦 Building frontend with Vite...');
  
  // Set build environment variables
  const buildEnv = {
    ...process.env,
    NODE_ENV: 'production',
    VITE_API_URL: '/api',
    NODE_OPTIONS: '--max-old-space-size=4096'
  };
  
  execSync('npx vite build --target=es2022', { 
    stdio: 'inherit',
    cwd: process.cwd(),
    env: buildEnv
  });
  
  console.log('✅ Frontend build completed successfully!');
  
  // Verify build output
  if (fs.existsSync('./dist')) {
    const files = fs.readdirSync('./dist');
    console.log('📁 Build output files:', files);
    
    // Check for critical files
    const requiredFiles = ['index.html'];
    const missing = requiredFiles.filter(file => !files.includes(file));
    if (missing.length > 0) {
      console.warn('⚠️ Missing required files:', missing);
    }
  } else {
    throw new Error('Build output directory not found');
  }
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

console.log('🎉 PrintLite frontend build completed for AWS Amplify deployment!');