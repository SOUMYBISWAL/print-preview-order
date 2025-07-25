// Simple build script for frontend-only deployment
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔨 Building PrintLite for AWS Amplify...');

try {
  // Clean previous builds
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // Run Vite build
  console.log('📦 Building frontend with Vite...');
  execSync('npx vite build', { stdio: 'inherit' });

  // Verify build output
  const buildDir = 'dist/public';
  if (fs.existsSync(buildDir)) {
    const files = fs.readdirSync(buildDir);
    console.log(`✅ Build successful! Generated ${files.length} files in ${buildDir}`);
    
    // Check for essential files
    const hasIndex = files.includes('index.html');
    const hasAssets = files.some(f => f.startsWith('assets'));
    
    if (hasIndex && hasAssets) {
      console.log('✅ Essential files present: index.html and assets');
    } else {
      console.warn('⚠️ Warning: Missing essential files');
    }
  } else {
    throw new Error('Build directory not found');
  }

  console.log('🚀 Ready for AWS Amplify deployment!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}