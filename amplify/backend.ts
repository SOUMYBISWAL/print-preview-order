import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

/**
 * AWS Amplify Gen 2 Backend Configuration
 * This defines the complete backend infrastructure for PrintLite
 */
export const backend = defineBackend({
  auth,
  data,
  storage,
});

// Configure storage bucket with CORS
backend.storage.resources.bucket.addCorsRule({
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
  allowedOrigins: ['*'],
  allowedHeaders: ['*'],
  exposedHeaders: ['ETag'],
  maxAge: 3000,
});

// Configure additional policies if needed
const { cfnUserPool } = backend.auth.resources.cfnResources;
cfnUserPool.policies = {
  passwordPolicy: {
    minimumLength: 8,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: false,
    requireUppercase: true,
  },
};