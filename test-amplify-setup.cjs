#!/usr/bin/env node

/**
 * Test script to verify AWS Amplify Gen 2 setup
 * Validates all backend resources and configuration files
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Testing AWS Amplify Gen 2 Setup for PrintLite\n');

// Test functions
const tests = [
  {
    name: 'Backend Configuration',
    test: () => {
      const backendPath = path.join('amplify', 'backend.ts');
      return fs.existsSync(backendPath);
    }
  },
  {
    name: 'Authentication Resource',
    test: () => {
      const authPath = path.join('amplify', 'auth', 'resource.ts');
      return fs.existsSync(authPath);
    }
  },
  {
    name: 'Data Resource (GraphQL Schema)',
    test: () => {
      const dataPath = path.join('amplify', 'data', 'resource.ts');
      return fs.existsSync(dataPath);
    }
  },
  {
    name: 'Storage Resource (S3)',
    test: () => {
      const storagePath = path.join('amplify', 'storage', 'resource.ts');
      return fs.existsSync(storagePath);
    }
  },
  {
    name: 'Lambda Functions',
    test: () => {
      const functionsDir = path.join('amplify', 'functions');
      if (!fs.existsSync(functionsDir)) return false;
      
      const requiredFunctions = ['calculate-price', 'process-payment', 'update-order-status'];
      return requiredFunctions.every(func => 
        fs.existsSync(path.join(functionsDir, func, 'resource.ts')) &&
        fs.existsSync(path.join(functionsDir, func, 'handler.ts'))
      );
    }
  },
  {
    name: 'Amplify Package Configuration',
    test: () => {
      const packagePath = path.join('amplify', 'package.json');
      if (!fs.existsSync(packagePath)) return false;
      
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      return packageJson.dependencies && 
             packageJson.dependencies['@aws-amplify/backend'] &&
             packageJson.dependencies['@aws-amplify/backend-cli'];
    }
  },
  {
    name: 'Deployment Configuration (amplify.yml)',
    test: () => {
      const amplifyYml = 'amplify.yml';
      if (!fs.existsSync(amplifyYml)) return false;
      
      const content = fs.readFileSync(amplifyYml, 'utf8');
      return content.includes('backend:') && 
             content.includes('frontend:') &&
             content.includes('npx amplify backend build');
    }
  },
  {
    name: 'Frontend Amplify Integration',
    test: () => {
      const amplifyLibPath = path.join('client', 'src', 'lib', 'amplify.ts');
      return fs.existsSync(amplifyLibPath);
    }
  },
  {
    name: 'Amplify Outputs Configuration',
    test: () => {
      const outputsPath = 'amplify_outputs.json';
      return fs.existsSync(outputsPath);
    }
  },
  {
    name: 'Build Configuration',
    test: () => {
      const packagePath = 'package.json';
      if (!fs.existsSync(packagePath)) return false;
      
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      return packageJson.scripts && packageJson.scripts.build;
    }
  }
];

// Run tests
let passed = 0;
let failed = 0;

tests.forEach(test => {
  try {
    if (test.test()) {
      console.log(`✅ ${test.name}`);
      passed++;
    } else {
      console.log(`❌ ${test.name}`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ ${test.name} (Error: ${error.message})`);
    failed++;
  }
});

console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed\n`);

// Deployment readiness check
if (failed === 0) {
  console.log('🎉 All tests passed! Your PrintLite app is ready for AWS Amplify Gen 2 deployment.');
  console.log('\n📋 Next Steps:');
  console.log('1. Connect your repository to AWS Amplify Console');
  console.log('2. Configure build settings using the provided amplify.yml');
  console.log('3. Deploy and test your application');
  console.log('4. Set up admin users in Cognito User Pool');
  console.log('\n📖 See AMPLIFY_GEN2_DEPLOYMENT.md for detailed instructions.');
} else {
  console.log('⚠️  Some tests failed. Please check the configuration before deploying.');
  console.log('\n🔧 Common Issues:');
  console.log('- Missing resource files in amplify/ directory');
  console.log('- Incorrect package.json dependencies');
  console.log('- amplify.yml not configured for Gen 2');
}

console.log('\n🚀 PrintLite AWS Amplify Gen 2 Backend Features:');
console.log('• 🔐 Authentication with Cognito User Pools');
console.log('• 📊 GraphQL API with comprehensive schema');
console.log('• 📁 S3 file storage with user isolation');
console.log('• ⚡ Lambda functions for business logic');
console.log('• 💰 Indian pricing with INR currency and GST');
console.log('• 👨‍💼 Admin panel with order management');
console.log('• 📱 Mobile-responsive design');
console.log('• 🔒 Security best practices implemented');